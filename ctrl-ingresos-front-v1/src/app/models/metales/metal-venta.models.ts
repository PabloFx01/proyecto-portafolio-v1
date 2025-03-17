export interface IMetalVenta {
    metalVentaId: MetalVentaId;
    descripcion:  string;
    editadoPor:   string | null;
    modificadoEl: Date | null;
}

export interface MetalVentaId {
    id:                number ;
    idMetalCompra:     string;    
} 