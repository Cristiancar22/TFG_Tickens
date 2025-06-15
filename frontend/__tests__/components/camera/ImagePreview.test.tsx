import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ImagePreview } from '@/components/camera';

describe('ImagePreview', () => {
    const uri = 'https://example.com/image.jpg';
    const mockOnSend = jest.fn();
    const mockOnClear = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza la imagen con la URI proporcionada', () => {
        const { getByLabelText } = render(
            <ImagePreview
                uri={uri}
                loading={true}
                onSend={mockOnSend}
                onClear={mockOnClear}
            />,
        );

        const image = getByLabelText('preview-image');
        expect(image.props.source).toEqual({ uri });
    });

    it('muestra el texto de carga si loading es true', () => {
        const { getByText } = render(
            <ImagePreview
                uri={uri}
                loading={true}
                onSend={mockOnSend}
                onClear={mockOnClear}
            />,
        );

        expect(getByText('Procesando ticket...')).toBeTruthy();
    });

    it('muestra los botones si loading es false', () => {
        const { getByLabelText } = render(
            <ImagePreview
                uri={uri}
                loading={false}
                onSend={mockOnSend}
                onClear={mockOnClear}
            />,
        );

        expect(getByLabelText('send-button')).toBeTruthy();
        expect(getByLabelText('clear-button')).toBeTruthy();
    });

    it('llama a onSend al presionar el botón de enviar', () => {
        const { getByLabelText } = render(
            <ImagePreview
                uri={uri}
                loading={false}
                onSend={mockOnSend}
                onClear={mockOnClear}
            />,
        );

        fireEvent.press(getByLabelText('send-button'));
        expect(mockOnSend).toHaveBeenCalledTimes(1);
    });

    it('llama a onClear al presionar el botón de volver', () => {
        const { getByLabelText } = render(
            <ImagePreview
                uri={uri}
                loading={false}
                onSend={mockOnSend}
                onClear={mockOnClear}
            />,
        );

        fireEvent.press(getByLabelText('clear-button'));
        expect(mockOnClear).toHaveBeenCalledTimes(1);
    });
});
