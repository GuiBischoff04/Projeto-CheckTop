
import React, { useRef, useEffect, useState } from 'react';
import type { ChecklistInstanceItem } from '../../types';
import { ChecklistItemStatus, ChecklistItemType } from '../../types';

interface ItemInputsProps {
    item: ChecklistInstanceItem;
    onStatusChange: (status: ChecklistItemStatus) => void;
    onValueChange: (value: string | number | null) => void;
    disabled?: boolean;
}

const statusConfig = {
    [ChecklistItemStatus.CONFORME]: { color: 'bg-emerald-500', text: 'Sim' },
    [ChecklistItemStatus.NAO_CONFORME]: { color: 'bg-red-500', text: 'Não' },
    [ChecklistItemStatus.NA]: { color: 'bg-gray-500', text: 'N/A' },
};

const ConformityCheckInput: React.FC<ItemInputsProps> = ({ item, onStatusChange, disabled }) => {
    if (disabled) return null; // No readonly mode, the status is shown in the card header
    
    return (
    <div className="flex flex-wrap gap-2">
        {Object.values(ChecklistItemStatus).filter(s => s !== ChecklistItemStatus.PENDENTE).map(status => (
            <button
                key={status}
                onClick={() => !disabled && onStatusChange(status)}
                disabled={disabled}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-transform transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 ${item.status === status ? `${statusConfig[status].color} text-white` : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
                {statusConfig[status].text}
            </button>
        ))}
    </div>
)};

const TextInput: React.FC<ItemInputsProps> = ({ item, onValueChange, disabled }) => (
    <input
        type="text"
        value={(item.value as string) || ''}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
    />
);

const NumberInput: React.FC<ItemInputsProps> = ({ item, onValueChange, disabled }) => {
    const minLength = item.min;
    const maxLength = item.max;
    // Treat value as string to properly handle character counts (e.g. leading zeros)
    const value = (item.value as string) || '';
    
    // Check if current value length is less than minimum
    const isError = value.length > 0 && ((minLength !== undefined && value.length < minLength));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValueStr = e.target.value;

        // Allow only digits
        if (!/^\d*$/.test(newValueStr)) {
            return;
        }

        // Handle empty input
        if (newValueStr === '') {
            onValueChange(null);
            return;
        }

        onValueChange(newValueStr);
    };

    return (
        <div className="w-full">
            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={value}
                onChange={handleChange}
                disabled={disabled}
                minLength={minLength}
                maxLength={maxLength}
                className={`w-full bg-gray-50 dark:bg-gray-700 border rounded-md shadow-sm p-2 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 ${isError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder={maxLength ? `Máximo ${maxLength} dígitos` : 'Digite números'}
            />
            {!disabled && (minLength !== undefined || maxLength !== undefined) && (
                <div className="flex justify-between text-xs mt-1">
                     <span className={`${isError ? 'text-red-500' : 'text-gray-500'}`}>
                        {minLength !== undefined && `Mín: ${minLength} dígitos`}
                    </span>
                    <span className="text-gray-500">
                        {maxLength !== undefined && `${value.length}/${maxLength}`}
                    </span>
                </div>
            )}
        </div>
    );
};

const PhotoInput: React.FC<ItemInputsProps> = ({ item, onValueChange, disabled }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onValueChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    return (
         <div>
            {!disabled && <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>}
            {item.value ? (
                <img src={item.value as string} alt="Preview" className="mt-2 rounded-md max-h-48" />
            ) : (
                disabled && <span className="text-gray-500 italic text-sm">Sem foto anexada</span>
            )}
        </div>
    )
};

const SignatureInput: React.FC<ItemInputsProps> = ({ item, onValueChange, disabled }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx && item.value) {
                const img = new Image();
                img.src = item.value as string;
                img.onload = () => ctx.drawImage(img, 0, 0);
            }
        }
    }, [item.value]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (disabled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || disabled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (disabled) return;
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            onValueChange(canvas.toDataURL());
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if(ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            onValueChange(null);
        }
    }

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={300}
                height={150}
                className={`border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 ${disabled ? 'cursor-default opacity-80' : 'cursor-crosshair'}`}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />
            {!disabled && <button onClick={clearCanvas} className="mt-2 text-sm text-red-500 hover:underline">Limpar</button>}
        </div>
    );
};

export const ItemInputs: React.FC<ItemInputsProps> = (props) => {
    switch (props.item.type) {
        case ChecklistItemType.CONFORMITY_CHECK:
            return <ConformityCheckInput {...props} />;
        case ChecklistItemType.TEXT:
            return <TextInput {...props} />;
        case ChecklistItemType.NUMBER:
            return <NumberInput {...props} />;
        case ChecklistItemType.PHOTO:
            return <PhotoInput {...props} />;
        case ChecklistItemType.SIGNATURE:
            return <SignatureInput {...props} />;
        // Add cases for DATE and RATING later
        default:
            return <p>Tipo de item não suportado: {props.item.type}</p>;
    }
};
