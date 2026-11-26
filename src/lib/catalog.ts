import { EXERCISE_DEMO_SOURCE_URL } from "@/constants/demo-video";
import { supabase } from "@/lib/supabase";

export type BodyPart = {
  id: string;
  name: string;
  icon: string;
};

export type Exercise = {
  id: string;
  bodyPartId: string;
  bodyPartName: string;
  name: string;
  instructions: string;
  videoUrl: string;
  thumbnailUrl: string | null;
};

const PARTS: BodyPart[] = [
  { id: "10000000-0000-4000-8000-000000000001", name: "chest", icon: "chest" },
  { id: "10000000-0000-4000-8000-000000000002", name: "back", icon: "back" },
  { id: "10000000-0000-4000-8000-000000000003", name: "shoulders", icon: "shoulders" },
  { id: "10000000-0000-4000-8000-000000000004", name: "arms", icon: "arms" },
  { id: "10000000-0000-4000-8000-000000000005", name: "legs", icon: "legs" },
  { id: "10000000-0000-4000-8000-000000000006", name: "core", icon: "core" },
];

const NAMES: Record<string, [string, string][]> = {
  chest: [
    ["Bench Press", "Lie on a bench and press the bar from chest to lockout."],
    ["Incline Dumbbell Press", "Press dumbbells on an incline bench."],
    ["Push-Up", "Lower your chest to the floor and press back up."],
    ["Chest Fly", "Open the arms wide, then bring the hands together over the chest."],
    ["Cable Crossover", "Bring the cables together in front of the chest."],
  ],
  back: [
    ["Pull-Up", "Hang from a bar and pull the chin above the bar."],
    ["Bent-Over Row", "Hinge at the hips and row the weight to the lower ribs."],
    ["Lat Pulldown", "Pull the bar to the upper chest, then control it back up."],
    ["Seated Cable Row", "Sit tall and pull the handle to the stomach."],
    ["Deadlift", "Hinge and stand up with the bar close to the legs."],
  ],
  shoulders: [
    ["Overhead Press", "Press the bar from the shoulders to lockout overhead."],
    ["Lateral Raise", "Raise the arms out to the sides to shoulder height."],
    ["Front Raise", "Raise the arms in front to shoulder height."],
    ["Rear Delt Fly", "With a slight hinge, raise the arms out to the sides."],
    ["Arnold Press", "Rotate the palms out as you press overhead."],
  ],
  arms: [
    ["Biceps Curl", "Curl the weight without swinging the torso."],
    ["Hammer Curl", "Curl with palms facing each other."],
    ["Triceps Pushdown", "Push the cable down until the elbows are straight."],
    ["Skull Crusher", "Lower the bar toward the forehead, then extend the elbows."],
    ["Dip", "Lower the body between the bars, then press back up."],
  ],
  legs: [
    ["Squat", "Sit the hips down and stand back up with the chest up."],
    ["Romanian Deadlift", "Hinge until you feel the hamstrings, then stand tall."],
    ["Leg Press", "Lower the sled until the knees bend, then press it away."],
    ["Lunge", "Step forward and drop the back knee, then push back."],
    ["Calf Raise", "Rise onto the toes and lower under control."],
  ],
  core: [
    ["Plank", "Hold a straight line from head to heels."],
    ["Crunch", "Curl the ribs toward the hips."],
    ["Hanging Leg Raise", "Hang and lift the legs in front of you."],
    ["Russian Twist", "Rotate the torso side to side with the feet lifted."],
    ["Cable Woodchop", "Pull the cable diagonally across the body."],
  ],
};

function localExercises(part: BodyPart): Exercise[] {
  return (NAMES[part.name] ?? []).map(([name, instructions], index) => ({
    id: `${part.id}-${index + 1}`,
    bodyPartId: part.id,
    bodyPartName: part.name,
    name,
    instructions,
    videoUrl: EXERCISE_DEMO_SOURCE_URL,
    thumbnailUrl: null,
  }));
}

const LOCAL: Exercise[] = PARTS.flatMap(localExercises);

export function labelPart(name: string): string {
  return name.slice(0, 1).toUpperCase() + name.slice(1);
}

type ExerciseRow = {
  id: string;
  body_part_id: string;
  name: string;
  instructions: string;
  video_url: string;
  thumbnail_url: string | null;
  body_parts: { name: string } | { name: string }[] | null;
};

function partName(row: ExerciseRow): string {
  const joined = row.body_parts;
  if (!joined) return "";
  if (Array.isArray(joined)) return joined[0]?.name ?? "";
  return joined.name;
}

function fromRow(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    bodyPartId: row.body_part_id,
    bodyPartName: partName(row),
    name: row.name,
    instructions: row.instructions,
    videoUrl: row.video_url,
    thumbnailUrl: row.thumbnail_url,
  };
}

export async function listBodyParts(): Promise<{
  parts: BodyPart[];
  error: string | null;
}> {
  if (!supabase) return { parts: PARTS, error: null };
  const { data, error } = await supabase.from("body_parts").select("id, name, icon");
  if (error) return { parts: [], error: error.message };
  const byName = new Map(
    ((data ?? []) as BodyPart[]).map((part) => [part.name, part]),
  );
  const parts = PARTS.map((part) => byName.get(part.name)).filter(
    (part): part is BodyPart => part != null,
  );
  return { parts, error: null };
}

export async function listExercises(
  bodyPartId: string,
): Promise<{ exercises: Exercise[]; error: string | null }> {
  if (!supabase) {
    return {
      exercises: LOCAL.filter((exercise) => exercise.bodyPartId === bodyPartId),
      error: null,
    };
  }
  const { data, error } = await supabase
    .from("exercises")
    .select("id, body_part_id, name, instructions, video_url, thumbnail_url, body_parts(name)")
    .eq("body_part_id", bodyPartId)
    .order("name");
  if (error) return { exercises: [], error: error.message };
  return { exercises: ((data ?? []) as ExerciseRow[]).map(fromRow), error: null };
}

export async function getExercise(
  id: string,
): Promise<{ exercise: Exercise | null; error: string | null }> {
  if (!supabase) {
    return { exercise: LOCAL.find((exercise) => exercise.id === id) ?? null, error: null };
  }
  const { data, error } = await supabase
    .from("exercises")
    .select("id, body_part_id, name, instructions, video_url, thumbnail_url, body_parts(name)")
    .eq("id", id)
    .maybeSingle();
  if (error) return { exercise: null, error: error.message };
  return { exercise: data ? fromRow(data as ExerciseRow) : null, error: null };
}

export function isVideoFileUrl(url: string): boolean {
  try {
    return /\.(mp4|mov|m4v|webm|m3u8)$/i.test(new URL(url).pathname);
  } catch {
    return false;
  }
}
