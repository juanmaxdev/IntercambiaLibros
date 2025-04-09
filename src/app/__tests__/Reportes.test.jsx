import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Reportes from '../../components/perfil/reportes';

// Para capturar el console.log en la prueba de envío correcto
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Componente Reportes', () => {
  test('Renderiza correctamente con campos vacíos', () => {
    render(<Reportes />);
    // Verifica que los inputs estén vacíos
    expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
    expect(screen.getByLabelText(/apellidos/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/título del mensaje/i)).toHaveValue('');
    expect(screen.getByLabelText('Mensaje', { selector: 'textarea' })).toHaveValue('');
    // Verifica que el checkbox no esté marcado
    expect(screen.getByLabelText(/acepto los términos/i)).not.toBeChecked();
  });

  test('Actualiza los valores del formulario al escribir', () => {
    render(<Reportes />);

    const nombreInput = screen.getByLabelText(/nombre/i);
    fireEvent.change(nombreInput, { target: { value: 'Juan' } });
    expect(nombreInput).toHaveValue('Juan');

    const apellidosInput = screen.getByLabelText(/apellidos/i);
    fireEvent.change(apellidosInput, { target: { value: 'Pérez' } });
    expect(apellidosInput).toHaveValue('Pérez');

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'juan@correo.com' } });
    expect(emailInput).toHaveValue('juan@correo.com');

    const motivoInput = screen.getByLabelText(/título del mensaje/i);
    fireEvent.change(motivoInput, { target: { value: 'Reporte' } });
    expect(motivoInput).toHaveValue('Reporte');

    const mensajeInput = screen.getByLabelText('Mensaje', { selector: 'textarea' });
    fireEvent.change(mensajeInput, { target: { value: 'Este es un mensaje con más de 20 caracteres.' } });
    expect(mensajeInput).toHaveValue('Este es un mensaje con más de 20 caracteres.');

    const checkbox = screen.getByLabelText(/acepto los términos/i);
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('Muestra errores de validación al enviar formulario vacío', () => {
    render(<Reportes />);

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    expect(screen.getAllByText(/este campo es obligatorio/i).length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText(/Debes aceptar los términos y condiciones/i)).toBeInTheDocument();
  });

  test('Muestra error por nombre muy corto', () => {
    render(<Reportes />);

    const nombreInput = screen.getByLabelText(/nombre/i);
    fireEvent.change(nombreInput, { target: { value: 'Jo' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    expect(screen.getByText(/El nombre debe contener al menos 3 caracteres/i)).toBeInTheDocument();
  });

  test('Muestra error por apellido muy corto', () => {
    render(<Reportes />);

    const apellidosInput = screen.getByLabelText(/apellidos/i);
    fireEvent.change(apellidosInput, { target: { value: 'Li' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    expect(screen.getByText(/El apellido debe contener al menos 3 caracteres/i)).toBeInTheDocument();
  });
  
  test('Muestra error por email inválido', async () => {
    render(<Reportes />);
  
    // Completar todos los campos obligatorios con datos válidos
    fireEvent.change(screen.getByPlaceholderText('Nombre'), {
      target: { value: 'Juan' },
    });
    fireEvent.change(screen.getByPlaceholderText('Apellidos'), {
      target: { value: 'Pérez' },
    });
    fireEvent.change(screen.getByPlaceholderText('Motivo'), {
      target: { value: 'Consulta' },
    });
    fireEvent.change(screen.getByPlaceholderText('Mensaje'), {
      target: { value: 'Este es un mensaje válido con más de 20 caracteres.' },
    });
    fireEvent.click(screen.getByLabelText(/acepto los términos/i));
  
    // Email inválido
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'emailinvalido' }, 
    });
  
    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
  
    // Esperar a que aparezca el mensaje de error
    const errorMessage = await screen.findByTestId('email-error-message');
    expect(errorMessage).toHaveTextContent('El email debe contener @');
  });
  

  
  test('Muestra error por motivo muy corto', () => {
    render(<Reportes />);
    
    const motivoInput = screen.getByLabelText(/título del mensaje/i);
    fireEvent.change(motivoInput, { target: { value: 'ab' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
    
    expect(screen.getByText(/El título debe contener al menos 3 caracteres/i)).toBeInTheDocument();
  });
  
  test('Muestra error por mensaje muy corto', () => {
    render(<Reportes />);
    
    const mensajeInput = screen.getByLabelText('Mensaje', { selector: 'textarea' });
    fireEvent.change(mensajeInput, { target: { value: 'Corto' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
    
    expect(
      screen.getByText(/El mensaje debe contener al menos 20 caracteres/i)
    ).toBeInTheDocument();
  });

  test('Envío exitoso del formulario con datos válidos', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  
    render(<Reportes />);
    
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/apellidos/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'juan@correo.com' } });
    fireEvent.change(screen.getByLabelText(/título del mensaje/i), { target: { value: 'Reporte' } });
    fireEvent.change(screen.getByPlaceholderText('Mensaje'), {
      target: { value: 'Este es un mensaje detallado con más de 20 caracteres.' },
    });
    fireEvent.click(screen.getByLabelText(/acepto los términos/i));
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
  
    expect(consoleSpy).toHaveBeenCalledWith('Formulario válido:', {
      nombre: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@correo.com',
      motivo: 'Reporte',
      mensaje: 'Este es un mensaje detallado con más de 20 caracteres.',
      acepto: true,
    });
  
    consoleSpy.mockRestore();
  });
  
});
