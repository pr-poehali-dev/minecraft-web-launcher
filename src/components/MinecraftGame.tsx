import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Square,
  Leaf,
  Axe,
  Sword,
  ShoppingBag 
} from 'lucide-react';

// Типы для инвентаря
type InventoryItem = {
  id: number;
  name: string;
  icon: React.ReactNode;
  count: number;
};

// Типы для блоков
type BlockType = 'grass' | 'dirt' | 'stone' | 'wood' | 'leaves';

interface Block {
  type: BlockType;
  x: number;
  y: number;
  z: number;
}

// Компонент блока в 3D
const MinecraftBlock = ({ type, x, y, z }: Block) => {
  const blockColors: Record<BlockType, { top: string, side: string, bottom: string }> = {
    grass: { 
      top: "bg-[#7CBA4D]", 
      side: "bg-[#91BD59] border-t-[4px] border-[#7CBA4D]", 
      bottom: "bg-[#866043]" 
    },
    dirt: { 
      top: "bg-[#866043]", 
      side: "bg-[#866043]", 
      bottom: "bg-[#866043]" 
    },
    stone: { 
      top: "bg-[#8F8F8F]", 
      side: "bg-[#8F8F8F]", 
      bottom: "bg-[#8F8F8F]" 
    },
    wood: { 
      top: "bg-[#9C7F4A] ring-1 ring-[#6B4F20] ring-inset", 
      side: "bg-[#6B4F20] bg-gradient-to-r from-[#6B4F20] to-[#6B4F20] via-[#5C421B]", 
      bottom: "bg-[#9C7F4A] ring-1 ring-[#6B4F20] ring-inset" 
    },
    leaves: { 
      top: "bg-[#6CBD6A]", 
      side: "bg-[#6CBD6A]", 
      bottom: "bg-[#6CBD6A]" 
    }
  };
  
  const colors = blockColors[type];
  
  return (
    <div 
      className="absolute w-[32px] h-[32px]"
      style={{ 
        transform: `translate3d(${x * 32}px, ${y * 32}px, ${z * 32}px)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Верх */}
      <div className={`absolute w-full h-full ${colors.top}`} style={{ transform: 'rotateX(90deg) translateZ(16px)' }}></div>
      
      {/* Низ */}
      <div className={`absolute w-full h-full ${colors.bottom}`} style={{ transform: 'rotateX(-90deg) translateZ(16px)' }}></div>
      
      {/* Стороны */}
      <div className={`absolute w-full h-full ${colors.side}`} style={{ transform: 'translateZ(16px)' }}></div>
      <div className={`absolute w-full h-full ${colors.side}`} style={{ transform: 'rotateY(180deg) translateZ(16px)' }}></div>
      <div className={`absolute w-full h-full ${colors.side}`} style={{ transform: 'rotateY(90deg) translateZ(16px)' }}></div>
      <div className={`absolute w-full h-full ${colors.side}`} style={{ transform: 'rotateY(-90deg) translateZ(16px)' }}></div>
    </div>
  );
};

// Компонент инвентаря
const Inventory = ({ 
  isOpen, 
  onClose, 
  items 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: InventoryItem[] 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-[#c6c6c6] border-4 border-[#555555] p-4 rounded-sm w-[80%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#555555]">Инвентарь</h2>
          <Button 
            onClick={onClose} 
            variant="destructive" 
            className="h-8 w-8 rounded-sm"
          >
            X
          </Button>
        </div>
        <div className="grid grid-cols-9 gap-2">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#8b8b8b] border-2 border-[#373737] p-2 h-12 w-12 flex flex-col items-center justify-center relative"
            >
              <div className="text-2xl">{item.icon}</div>
              {item.count > 1 && (
                <span className="absolute bottom-0 right-0 text-white text-xs font-bold">
                  {item.count}
                </span>
              )}
            </div>
          ))}
          {Array(36 - items.length).fill(0).map((_, i) => (
            <div 
              key={`empty-${i}`} 
              className="bg-[#8b8b8b] border-2 border-[#373737] h-12 w-12"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Компонент горячая панель
const Hotbar = ({ 
  items 
}: { 
  items: InventoryItem[] 
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
      <div className="flex space-x-1">
        {items.slice(0, 9).map((item) => (
          <div 
            key={item.id} 
            className="bg-[#8b8b8b] border-2 border-t-[#FFFFFF80] border-l-[#FFFFFF80] border-r-[#00000080] border-b-[#00000080] p-2 h-12 w-12 flex items-center justify-center relative"
          >
            <div className="text-2xl">{item.icon}</div>
            {item.count > 1 && (
              <span className="absolute bottom-0 right-0 text-white text-xs font-bold">
                {item.count}
              </span>
            )}
          </div>
        ))}
        {Array(9 - Math.min(items.length, 9)).fill(0).map((_, i) => (
          <div 
            key={`empty-hotbar-${i}`} 
            className="bg-[#8b8b8b] border-2 border-t-[#FFFFFF80] border-l-[#FFFFFF80] border-r-[#00000080] border-b-[#00000080] h-12 w-12"
          />
        ))}
      </div>
    </div>
  );
};

// Основной компонент игры
const MinecraftGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 5, y: 1, z: 5 });
  const [cameraRotation, setCameraRotation] = useState({ x: 0, y: 0 });
  
  // Создание карты мира
  const [blocks, setBlocks] = useState<Block[]>([]);
  
  // Инициализация мира
  useEffect(() => {
    if (gameStarted && blocks.length === 0) {
      const newBlocks: Block[] = [];
      
      // Создаем плоскость из блоков земли
      for (let x = 0; x < 10; x++) {
        for (let z = 0; z < 10; z++) {
          newBlocks.push({ type: 'grass', x, y: 2, z });
          newBlocks.push({ type: 'dirt', x, y: 3, z });
          newBlocks.push({ type: 'dirt', x, y: 4, z });
        }
      }
      
      // Добавляем несколько деревянных блоков (ствол дерева)
      newBlocks.push({ type: 'wood', x: 3, y: 1, z: 3 });
      newBlocks.push({ type: 'wood', x: 3, y: 0, z: 3 });
      newBlocks.push({ type: 'wood', x: 3, y: -1, z: 3 });
      
      // Добавляем листву
      for (let x = 2; x <= 4; x++) {
        for (let z = 2; z <= 4; z++) {
          for (let y = -3; y <= -1; y++) {
            if (!(x === 3 && z === 3 && y > -3)) {
              newBlocks.push({ type: 'leaves', x, y, z });
            }
          }
        }
      }
      
      // Добавляем камень
      newBlocks.push({ type: 'stone', x: 7, y: 1, z: 7 });
      newBlocks.push({ type: 'stone', x: 7, y: 1, z: 8 });
      newBlocks.push({ type: 'stone', x: 8, y: 1, z: 7 });
      
      setBlocks(newBlocks);
    }
  }, [gameStarted, blocks.length]);
  
  // Пример инвентаря с иконками
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Блок земли', icon: <Square className="text-yellow-800" />, count: 64 },
    { id: 2, name: 'Дерево', icon: <Leaf className="text-green-700" />, count: 32 },
    { id: 3, name: 'Кирка', icon: <Axe className="text-gray-500" />, count: 1 },
    { id: 4, name: 'Меч', icon: <Sword className="text-gray-400" />, count: 1 }
  ]);

  // Обработка клавиш для перемещения и инвентаря
  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'e') {
        setIsInventoryOpen(prev => !prev);
        return;
      }

      if (isInventoryOpen) return;

      const speed = 0.2;
      // Вычисляем направление движения относительно поворота камеры
      const angle = (cameraRotation.y * Math.PI) / 180;
      const forwardX = Math.sin(angle);
      const forwardZ = Math.cos(angle);

      switch (e.key) {
        case 'w':
          setPlayerPosition(prev => ({ 
            ...prev, 
            x: prev.x + forwardX * speed, 
            z: prev.z + forwardZ * speed 
          }));
          break;
        case 's':
          setPlayerPosition(prev => ({ 
            ...prev, 
            x: prev.x - forwardX * speed, 
            z: prev.z - forwardZ * speed 
          }));
          break;
        case 'a':
          setPlayerPosition(prev => ({ 
            ...prev, 
            x: prev.x - forwardZ * speed, 
            z: prev.z + forwardX * speed 
          }));
          break;
        case 'd':
          setPlayerPosition(prev => ({ 
            ...prev, 
            x: prev.x + forwardZ * speed, 
            z: prev.z - forwardX * speed 
          }));
          break;
        case ' ':
          // Прыжок
          setPlayerPosition(prev => ({ ...prev, y: prev.y - 1 }));
          setTimeout(() => {
            setPlayerPosition(prev => ({ ...prev, y: prev.y + 1 }));
          }, 500);
          break;
      }
    };

    // Обработка движения мыши для поворота камеры
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === gameContainerRef.current) {
        setCameraRotation(prev => ({
          x: Math.max(-90, Math.min(90, prev.x - e.movementY * 0.1)),
          y: (prev.y + e.movementX * 0.1) % 360
        }));
      }
    };

    // Блокировка курсора при клике на игровую область
    const handleGameClick = () => {
      if (gameContainerRef.current) {
        gameContainerRef.current.requestPointerLock();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    if (gameContainerRef.current) {
      gameContainerRef.current.addEventListener('click', handleGameClick);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      if (gameContainerRef.current) {
        gameContainerRef.current.removeEventListener('click', handleGameClick);
      }
    };
  }, [gameStarted, isInventoryOpen, cameraRotation]);

  // Начало игры
  const startGame = () => {
    setGameStarted(true);
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {!gameStarted ? (
        <div className="h-full w-full flex flex-col items-center justify-center bg-[url('/placeholder.svg')] bg-cover">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              Майнкрафт Онлайн
            </h1>
            <p className="text-xl text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              Нажми на картинку, чтобы начать игру
            </p>
          </div>
          <div 
            className="relative cursor-pointer transform transition-transform hover:scale-105"
            onClick={startGame}
          >
            <img 
              src="/placeholder.svg" 
              alt="Minecraft World" 
              className="w-[400px] h-[225px] rounded-lg shadow-lg object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-xl">
                Играть
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          ref={gameContainerRef} 
          className="h-full w-full bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] relative focus:outline-none overflow-hidden"
          style={{ perspective: '1000px' }}
          tabIndex={0}
        >
          {/* 3D мир */}
          <div 
            className="absolute inset-0"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: `rotateX(${cameraRotation.x}deg) rotateY(${cameraRotation.y}deg) translate3d(${-playerPosition.x * 32}px, ${-playerPosition.y * 32}px, ${-playerPosition.z * 32}px)`
            }}
          >
            {/* Все блоки мира */}
            {blocks.map((block, index) => (
              <MinecraftBlock
                key={index}
                {...block}
              />
            ))}
          </div>
          
          {/* Прицел в центре экрана */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 0H9V16H7V0Z" fill="white" fillOpacity="0.8"/>
              <path d="M16 7V9H0V7H16Z" fill="white" fillOpacity="0.8"/>
            </svg>
          </div>
          
          {/* Интерфейс */}
          <Hotbar items={inventory} />
          
          {/* Инвентарь */}
          <Inventory 
            isOpen={isInventoryOpen} 
            onClose={() => setIsInventoryOpen(false)} 
            items={inventory} 
          />
          
          {/* Инструкции */}
          <div className="fixed top-4 left-4 text-white text-sm bg-black/50 p-2 rounded">
            <p>WASD - движение</p>
            <p>Пробел - прыжок</p>
            <p>Мышь - осмотреться</p>
            <p>E - открыть инвентарь</p>
            <p>Клик - взаимодействие</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinecraftGame;