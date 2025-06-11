import { CameraViewComponent } from '@/components/camera';
import { render, fireEvent } from '@testing-library/react-native';

describe('CameraViewComponent', () => {
    it('llama a los handlers correctamente', () => {
        const mockToggleFlash = jest.fn();
        const mockFlipCamera = jest.fn();
        const mockCapture = jest.fn();
        const mockSelectFile = jest.fn();
        const mockSetRef = jest.fn();
        const mockOnReady = jest.fn();

        const { getByLabelText } = render(
            <CameraViewComponent
                facing="back"
                flash="off"
                onToggleFlash={mockToggleFlash}
                onFlipCamera={mockFlipCamera}
                onCapture={mockCapture}
                onSelectFile={mockSelectFile}
                setCameraRef={mockSetRef}
                onCameraReady={mockOnReady}
            />
        );

        fireEvent.press(getByLabelText('toggle-flash-button'));
        fireEvent.press(getByLabelText('select-file-button'));
        fireEvent.press(getByLabelText('capture-button'));
        fireEvent.press(getByLabelText('flip-camera-button'));

        expect(mockToggleFlash).toHaveBeenCalled();
        expect(mockSelectFile).toHaveBeenCalled();
        expect(mockCapture).toHaveBeenCalled();
        expect(mockFlipCamera).toHaveBeenCalled();
    });
});
