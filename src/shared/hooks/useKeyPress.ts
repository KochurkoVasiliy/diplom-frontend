import { useEffect } from 'react';

export const useKeyPress = (targetKey, callback) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === targetKey) {
                callback();
            }
        };

        // Добавляем обработчик события keydown
        document.addEventListener('keydown', handleKeyDown);

        // Убираем обработчик при размонтировании компонента
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [targetKey, callback]); // Зависимости: targetKey и callback
};
