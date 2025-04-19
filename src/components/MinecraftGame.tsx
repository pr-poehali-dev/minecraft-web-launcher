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
          <h2 className="text-xl font-minecraft text-[#555555]">Инвентарь</h2>
          <Button 
            onClick={onClose} 
            variant="destructive" 
            className="h-8 w-8 rounded-none"
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
            className="bg-[#8b8b8b] border-2 border-[#373737] p-2 h-12 w-12 flex items-center justify-center relative"
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
            className="bg-[#8b8b8b] border-2 border-[#373737] h-12 w-12"
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
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  
  // Пример инвентаря с исправленными иконками
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

      const speed = 10;
      switch (e.key) {
        case 'w':
        case 'ArrowUp':
          setPlayerPosition(prev => ({ ...prev, y: Math.max(0, prev.y - speed) }));
          break;
        case 's':
        case 'ArrowDown':
          setPlayerPosition(prev => ({ ...prev, y: Math.min(100, prev.y + speed) }));
          break;
        case 'a':
        case 'ArrowLeft':
          setPlayerPosition(prev => ({ ...prev, x: Math.max(0, prev.x - speed) }));
          break;
        case 'd':
        case 'ArrowRight':
          setPlayerPosition(prev => ({ ...prev, x: Math.min(100, prev.x + speed) }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted, isInventoryOpen]);

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
          className="h-full w-full bg-[#87CEEB] relative focus:outline-none"
          tabIndex={0}
        >
          {/* Небо и земля */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#8B5A2B]"></div>
          <div className="absolute bottom-[50%] left-0 right-0 h-[1px] bg-[#8B5A2B]"></div>
          
          {/* Блоки в мире (упрощенный пример) */}
          <div className="absolute bottom-[50%] left-[30%] w-16 h-16 bg-[#8B5A2B]"></div>
          <div className="absolute bottom-[50%] left-[40%] w-16 h-16 bg-[#8B5A2B]"></div>
          <div className="absolute bottom-[50%] left-[50%] w-16 h-16 bg-[#8B5A2B]"></div>
          <div className="absolute bottom-[60%] left-[50%] w-16 h-16 bg-[#7D7D7D]"></div>
          
          {/* Деревья */}
          <div className="absolute bottom-[50%] left-[20%] w-16 h-48 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#6B4226]"></div>
            <div className="w-48 h-32 bg-[#267F00] rounded-lg transform -translate-y-4"></div>
          </div>
          
          {/* Игрок */}
          <div 
            className="absolute w-8 h-16 bg-blue-500 z-10"
            style={{ 
              left: `${playerPosition.x}%`, 
              top: `${playerPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          ></div>
          
          {/* Прицел в центре экрана */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-6 h-[1px] bg-white"></div>
            <div className="h-6 w-[1px] bg-white transform -translate-y-[50%] translate-x-[50%]"></div>
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
            <p>E - открыть инвентарь</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinecraftGame;