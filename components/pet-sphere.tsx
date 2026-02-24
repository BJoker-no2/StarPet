"use client";

import { useState } from "react";
import { PetBubble, type PetData } from "./pet-bubble";
import { MemoryCard } from "./memory-card";

const MOCK_PETS: PetData[] = [
  {
    id: 1,
    name: "小团子",
    image: "/images/pet-1.jpg",
    message: "在二次元的世界里，也要开心地吃肉肉哦。",
    flowers: 42,
    isNew: false,
  },
  {
    id: 2,
    name: "雪球",
    image: "/images/pet-2.jpg",
    message: "你永远是我最柔软的牵挂，我的小天使。",
    flowers: 89,
    isNew: true,
  },
  {
    id: 3,
    name: "橘座大人",
    image: "/images/pet-3.jpg",
    message: "每一颗星星都是你在天上眨的眼睛。",
    flowers: 156,
    isNew: false,
  },
  {
    id: 4,
    name: "阿拉斯加",
    image: "/images/pet-4.jpg",
    message: "跑吧，在没有尽头的雪原上自由奔跑。",
    flowers: 31,
    isNew: true,
  },
  {
    id: 5,
    name: "英短妹妹",
    image: "/images/pet-5.jpg",
    message: "你的陪伴是我最珍贵的回忆，永远想你。",
    flowers: 67,
    isNew: false,
  },
  {
    id: 6,
    name: "柯基蛋蛋",
    image: "/images/pet-6.jpg",
    message: "那个小短腿永远在我心里跑来跑去。",
    flowers: 203,
    isNew: false,
  },
];

export function PetSphere() {
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null);

  return (
    <>
      <div className="relative h-full w-full overflow-hidden">
        {/* Central starfield area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-full max-w-4xl">
            {MOCK_PETS.map((pet, index) => (
              <PetBubble
                key={pet.id}
                pet={pet}
                index={index}
                onSelect={setSelectedPet}
                entranceDelay={800 + index * 300}
              />
            ))}
          </div>
        </div>
      </div>

      <MemoryCard
        pet={selectedPet}
        onClose={() => setSelectedPet(null)}
      />
    </>
  );
}
