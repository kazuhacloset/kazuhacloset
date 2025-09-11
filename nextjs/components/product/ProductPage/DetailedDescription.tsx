"use client";

type Props = {
  description: string;
};

export default function DetailedDescription({ description }: Props) {
  return (
    <div className="mt-12 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/20">
      <h2 className="text-lg sm:text-xl font-bold mb-2">Detailed Description</h2>
      <p className="text-gray-300 text-xs sm:text-base leading-relaxed">{description}</p>
    </div>
  );
}
