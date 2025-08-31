// Biblioteca.ts (Código Completo)
import { Libro } from "./Libro";
import { Socio, SocioFactory, TipoSocio } from "./Socio";
import { 
  IBuscable, 
  CatalogoBiblioteca, 
  BibliotecaDigital, 
  ArchivoHistorico, 
  BaseConocimiento 
} from "./Buscador";

class Biblioteca {
  private inventario: Libro[] = [];
  private socios: Socio[] = [];
  private buscadores: IBuscable<any>[]; 

  constructor() {
    this.buscadores = [
      new CatalogoBiblioteca(["libro1", "libro2"]),
      new BibliotecaDigital(["recurso1", "recurso2"]),
      new ArchivoHistorico(["documento1", "documento2"]),
      new BaseConocimiento(["articulo1", "articulo2"])
    ];
  }


  agregarLibro(titulo: string, autor: string, isbn: string): Libro {
    const libroCreado = new Libro(titulo, autor, isbn);
    this.inventario.push(libroCreado);
    return libroCreado;
  }

  buscarLibro(isbn: string): Libro | null {
    const libroEncontrado = this.inventario.find(
      (libro) => libro.id === isbn
    );
    return libroEncontrado || null;
  }

 
  registrarSocio(tipo: TipoSocio, id: number, nombre: string, apellido: string): Socio {
    const socioCreado = SocioFactory.crearSocio(tipo, id, nombre, apellido);
    this.socios.push(socioCreado);
    return socioCreado;
  }

  buscarSocio(id: number): Socio | null {
    return this.socios.find((socio) => socio.id === id) ?? null;
  }

  retirarLibro(socioId: number, libroISBN: string): void {
    const socio = this.buscarSocio(socioId);
    const libro = this.buscarLibro(libroISBN);

    if (!socio || !libro) {
      throw new Error("No se encontro");
    }
    
   
    if (this.libroYaPrestado(libro)) {
      throw new Error("Libro no esta disponible");
    }

    socio.retirar(libro);
  }

  devolverLibro(socioId: number, libroISBN: string) {
    const socio = this.buscarSocio(socioId);
    const libro = this.buscarLibro(libroISBN);

    if (!socio || !libro) {
      throw new Error("No se encontro");
    }

    socio.devolver(libro);
  }
  
  private libroYaPrestado(libro: Libro): boolean {
    return this.socios.some(s => s.tienePrestadoLibro(libro));
  }


  public buscarUniversal(criterio: string): any[] {
    let resultados: any[] = [];
    for (const buscador of this.buscadores) {
      resultados = resultados.concat(buscador.buscarPor(criterio));
    }
    return resultados;
  }

  public filtrarUniversal(condicion: (item: any) => boolean): any[] {
    let resultados: any[] = [];
    for (const buscador of this.buscadores) {
      resultados = resultados.concat(buscador.filtrar(condicion));
    }
    return resultados;
  }
}

export const biblioteca = new Biblioteca();
export type { Biblioteca };