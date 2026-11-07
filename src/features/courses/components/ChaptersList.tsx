"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Pencil } from "lucide-react";
import { Chapter } from "../interfaces/course.interface";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
  disabled?: boolean;
}

// بصمة نصية لمحتوى القائمة: تتغير فقط إذا تغيّر الترتيب أو البيانات فعلاً
const getSignature = (list: Chapter[]) =>
  list.map((c) => `${c.id}:${c.title}:${c.isPublished}`).join("|");

// ───────────── صف واحد (مكوّن مستقل لأن useDragControls hook) ─────────────
interface ChapterRowProps {
  chapter: Chapter;
  index: number;
  disabled: boolean;
  onEdit: (id: string) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function ChapterRow({
  chapter,
  index,
  disabled,
  onEdit,
  onDragStart,
  onDragEnd,
}: ChapterRowProps) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={chapter}
      dragListener={false} // الصف نفسه لا يبدأ السحب
      dragControls={controls} // المقبض وحده يبدؤه
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`relative group flex items-center justify-between rounded-lg border border-border bg-muted/30 text-sm transition-colors ${
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:border-primary/40 hover:bg-muted/60"
      }`}
    >
      <div className="flex items-center gap-2.5 p-3 font-medium text-foreground">
        {/* مقبض السحب: الوحيد الذي يبدأ السحب */}
        <div
          onPointerDown={(e) => {
            if (!disabled) controls.start(e);
          }}
          style={{ touchAction: "none" }}
          className={`p-1 rounded-md hover:bg-accent text-muted-foreground group-hover:text-foreground transition-colors ${
            disabled
              ? "cursor-not-allowed"
              : "cursor-grab active:cursor-grabbing"
          }`}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
          {index + 1}
        </span>

        <span className="truncate max-w-[200px] sm:max-w-[280px]">
          {chapter.title}
        </span>
      </div>

      <div className="flex items-center gap-2 pr-3">
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
            chapter.isPublished
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-muted text-muted-foreground border-border"
          }`}
        >
          {chapter.isPublished ? "Published" : "Draft"}
        </span>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onEdit(chapter.id)}
          className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
          title="Edit chapter"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </Reorder.Item>
  );
}

// ───────────── القائمة ─────────────
export const ChaptersList = ({
  items,
  onReorder,
  onEdit,
  disabled = false,
}: ChaptersListProps) => {
  const [chapters, setChapters] = useState<Chapter[]>(items);
  const [prevSignature, setPrevSignature] = useState(() => getSignature(items));
  const [isDragging, setIsDragging] = useState(false);

  // Syncing while drawing: Only when the real content changes, not while drawing.
  const signature = getSignature(items);
  if (!isDragging && signature !== prevSignature) {
    setPrevSignature(signature);
    setChapters(items);
  }

  const handleDragEnd = () => {
    setIsDragging(false);
    if (disabled) return;

    const hasOrderChanged = chapters.some(
      (chapter, index) => chapter.id !== items[index]?.id,
    );
    if (!hasOrderChanged) return;

    const bulkUpdatePayload = chapters.map((chapter, index) => ({
      id: chapter.id,
      position: index + 1,
    }));

    onReorder(bulkUpdatePayload);
  };

  return (
    <Reorder.Group
      axis="y"
      values={chapters}
      onReorder={setChapters}
      className="flex flex-col gap-2.5"
    >
      {chapters.map((chapter, index) => (
        <ChapterRow
          key={chapter.id}
          chapter={chapter}
          index={index}
          disabled={disabled}
          onEdit={onEdit}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        />
      ))}
    </Reorder.Group>
  );
};
