export class ErrorPersonalizado extends Error {
  constructor(mensaje, tipo, detalles = null) {
    super(mensaje);
    this.tipo = tipo;
    this.detalles = detalles;
  }
}