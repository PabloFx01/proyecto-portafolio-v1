export interface IPctXConceptoId {
    id: number | null,
    detalleIngresoId : number | null,
    idIngreso: number | null
}

export interface IPorcentajeXConcepto{
    pctXConceptoId : IPctXConceptoId | null,
    montoAsigRest: number | null,
    montoAsigRealEfec: number | null,
    montoAsigRealDig: number | null
}