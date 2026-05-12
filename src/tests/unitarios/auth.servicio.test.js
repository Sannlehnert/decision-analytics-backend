import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { crearAuthServicio } from '../../servicios/auth.servicio.js';

describe('Auth Servicio - Registrar', () => {
  let authServicio;
  let usuarioRepositorio;

  beforeEach(() => {
    // Creamos un mock puro del repositorio
    usuarioRepositorio = {
      buscarPorEmail: jest.fn(),
      crear: jest.fn(),
      buscarPorId: jest.fn(),
    };
    authServicio = crearAuthServicio(usuarioRepositorio);
  });

  test('debe crear un nuevo usuario', async () => {
    usuarioRepositorio.buscarPorEmail.mockResolvedValue(null);
    usuarioRepositorio.crear.mockResolvedValue(1);
    const resultado = await authServicio.registrar({ email: 'nuevo@test.com', clave: '12345678' });
    expect(resultado).toEqual({ id: 1, email: 'nuevo@test.com' });
    expect(usuarioRepositorio.crear).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'nuevo@test.com' })
    );
  });

  test('debe lanzar error si email existe', async () => {
    usuarioRepositorio.buscarPorEmail.mockResolvedValue({ id: 99 });
    await expect(
      authServicio.registrar({ email: 'existe@test.com', clave: '12345678' })
    ).rejects.toThrow('El email ya está registrado');
  });
});