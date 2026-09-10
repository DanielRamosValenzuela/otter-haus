export interface LegalGuideSection {
  id: string;
  title: string;
  body: string[];
}

export const LEGAL_GUIDE_INTRO =
  "Comprar o arrendar una propiedad en Chile implica varios pasos legales. Aquí resumimos lo esencial para que llegues informado a cada etapa del proceso. Esta guía es informativa — para tu caso particular, siempre te acompañamos en cada paso.";

export const LEGAL_GUIDE_SECTIONS: LegalGuideSection[] = [
  {
    id: "documentos-compra",
    title: "Documentos necesarios para comprar",
    body: [
      "Cédula de identidad vigente de todos los compradores.",
      "Certificado de dominio vigente y certificado de hipotecas y gravámenes de la propiedad, emitidos por el Conservador de Bienes Raíces.",
      "Si compras con crédito hipotecario: pre-aprobación bancaria, liquidaciones de sueldo o declaraciones de renta (independientes) y certificado de deuda vigente.",
    ],
  },
  {
    id: "pasos-compraventa",
    title: "Pasos del proceso de compraventa",
    body: [
      "1. Oferta y reserva: se firma una promesa de compraventa con un monto de reserva.",
      "2. Estudio de títulos: un abogado revisa que la propiedad esté libre de problemas legales (hipotecas no informadas, litigios, embargos).",
      "3. Firma de escritura ante notario.",
      "4. Inscripción en el Conservador de Bienes Raíces — este paso formaliza el cambio de dueño.",
    ],
  },
  {
    id: "costos-asociados",
    title: "Costos asociados a la compra",
    body: [
      "Gastos notariales y de inscripción en el Conservador de Bienes Raíces.",
      "Impuesto de timbres y estampillas (si aplica, según la operación y forma de pago).",
      "Honorarios del abogado que realiza el estudio de títulos.",
      "Comisión de corretaje — te la detallamos siempre antes de iniciar cualquier proceso, sin sorpresas.",
    ],
  },
  {
    id: "documentos-arriendo",
    title: "Documentos necesarios para arrendar",
    body: [
      "Cédula de identidad vigente.",
      "Liquidaciones de sueldo (últimos 3 meses) o certificado de renta si eres independiente.",
      "Aval o garantía, según lo que solicite el propietario — puede ser un aval con renta demostrable o un seguro de arriendo.",
    ],
  },
  {
    id: "contrato-arriendo",
    title: "Contrato y garantías de arriendo",
    body: [
      "El contrato de arriendo debe especificar duración, monto, forma de reajuste (si aplica) y condiciones de término anticipado.",
      "Es habitual solicitar un mes de garantía, que se devuelve al finalizar el contrato descontando eventuales daños o deudas pendientes.",
      "Recomendamos siempre hacer un check-in fotográfico del estado de la propiedad al recibirla.",
    ],
  },
];
