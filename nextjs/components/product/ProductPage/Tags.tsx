"use client";

type Props = {
  tags: string[];
};

export default function Tags({ tags }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="text-xs sm:text-sm bg-white/10 border border-white/20 px-3 py-1 rounded-full hover:bg-white/20 transition"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
