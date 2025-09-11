"use client";
import Image from "next/image";

type Props = {
  images: { url: string; alt: string }[];
  mainImage: string;
  setMainImage: (img: string) => void;
  name: string;
};

export default function ProductImages({ images, mainImage, setMainImage, name }: Props) {
  return (
    <div>
      <div className="mx-auto sm:mx-0 w-full sm:w-[550px] h-[500px] border border-white/20 bg-black/40 rounded-2xl overflow-hidden flex items-center justify-center">
        <Image
          src={mainImage}
          alt={name}
          width={550}
          height={500}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-4 mt-6 justify-center sm:justify-start">
        {images.map((img, idx) => {
          const imgUrl = img.url.startsWith("/") ? img.url : `/${img.url}`;
          return (
            <button
              key={idx}
              onClick={() => setMainImage(imgUrl)}
              className={`rounded-xl overflow-hidden border transition-all duration-200 relative
                w-[120px] h-[160px] sm:w-[180px] sm:h-[220px]
                ${mainImage === imgUrl ? "border-white scale-105" : "border-white/20 hover:border-white"}`}
            >
              <Image
                src={imgUrl}
                alt={img.alt || `Image ${idx + 1}`}
                width={180}
                height={220}
                className="object-cover rounded-xl w-full h-full"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
