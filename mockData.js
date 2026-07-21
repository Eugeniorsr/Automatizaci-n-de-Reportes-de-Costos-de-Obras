// Datos de prueba para el Sistema de Reportes de Costos de Obra
// Simulan registros extraídos de Softland ERP

window.initialEncargados = [
  { id: "1", nombre: "Juan Pérez", email: "juan.perez@constructora.cl", cencos: ["101", "102"] },
  { id: "2", nombre: "María González", email: "maria.gonzalez@constructora.cl", cencos: ["103"] },
  { id: "3", nombre: "Carlos Silva", email: "carlos.silva@constructora.cl", cencos: ["104"] },
  { id: "4", nombre: "Ana Morales", email: "ana.morales@constructora.cl", cencos: ["101", "104"] },
  { id: "5", nombre: "Administrador General", email: "admin@constructora.cl", cencos: ["101", "102", "103", "104"], isAdmin: true }
];

window.initialCencos = [
  { id: "101", nombre: "Edificio Mirador" },
  { id: "102", nombre: "Condominio Los Alerces" },
  { id: "103", nombre: "Ruta 5 Sur - Tramo A" },
  { id: "104", nombre: "Puente Bío Bío" }
];

// Función para generar transacciones realistas para varios meses del 2026
window.generateMockTransactions = function() {
  const transactions = [];
  const cencos = window.initialCencos;
  
  // Categorías de glosas comunes
  const rubros = [
    { glosas: ["Compra Hormigón H30 - Melón", "Suministro Cemento Especial", "Aditivos Hormigón"], cat: "Materiales", debeMin: 1200000, debeMax: 5000000 },
    { glosas: ["Compra Fierro Estructura AZA", "Malla Acma C292", "Fierro Estriado 12mm"], cat: "Materiales", debeMin: 800000, debeMax: 4000000 },
    { glosas: ["Pago Subcontrato Moldajes", "Subcontrato Enfardadura Fierro", "Subcontrato Instalaciones Sanitarias"], cat: "Subcontratos", debeMin: 2000000, debeMax: 8000000 },
    { glosas: ["Arriendo Retroexcavadora JCB", "Arriendo Grúa Torre Mes", "Combustible Generador Diésel"], cat: "Maquinaria y Equipos", debeMin: 500000, debeMax: 2500000 },
    { glosas: ["Sueldo Operarios Carpinteros", "Remuneraciones Jornales Quincena", "Horas Extras Personal Obra"], cat: "Mano de Obra", debeMin: 3000000, debeMax: 7000000 },
    { glosas: ["Epp Cascos y Guantes", "Adquisición Artículos de Seguridad", "Instalación Faena y Letreros"], cat: "Gastos Generales", debeMin: 150000, debeMax: 800000 },
    { glosas: ["Consumo Eléctrico Faena", "Abastecimiento Agua Aljibe", "Gastos Notariales Contratos"], cat: "Gastos Generales", debeMin: 80000, debeMax: 400000 }
  ];

  let docNumber = 100450;
  
  // Generar datos para Enero a Junio de 2026
  const meses = [
    { num: "01", nombre: "Enero", dias: 31 },
    { num: "02", nombre: "Febrero", dias: 28 },
    { num: "03", nombre: "Marzo", dias: 31 },
    { num: "04", nombre: "Abril", dias: 30 },
    { num: "05", nombre: "Mayo", dias: 31 },
    { num: "06", nombre: "Junio", dias: 30 }
  ];

  cencos.forEach(cenco => {
    let runningBalance = 0;
    
    meses.forEach(mes => {
      // Cantidad de movimientos por mes por obra (entre 8 y 15)
      const numMovs = Math.floor(Math.random() * 8) + 8;
      
      for (let i = 0; i < numMovs; i++) {
        const dia = String(Math.floor(Math.random() * mes.dias) + 1).padStart(2, '0');
        const fecha = `2026-${mes.num}-${dia}`;
        
        // Seleccionar un rubro al azar
        const rubro = rubros[Math.floor(Math.random() * rubros.length)];
        const glosa = rubro.glosas[Math.floor(Math.random() * rubro.glosas.length)];
        
        // 95% de los movimientos son costos (debe), 5% son correcciones/devoluciones (haber)
        const isCost = Math.random() < 0.95;
        let debe = 0;
        let haber = 0;
        
        if (isCost) {
          debe = Math.floor(Math.random() * (rubro.debeMax - rubro.debeMin) + rubro.debeMin);
          runningBalance += debe;
        } else {
          haber = Math.floor(Math.random() * (rubro.debeMin / 2));
          runningBalance -= haber;
        }
        
        docNumber++;
        const cpteNumber = 1000 + i + parseInt(mes.num) * 100;
        
        // Mapear Cuenta Contable según categoría
        let ctaNro = "5105001";
        let ctaNombre = "Gastos Generales de Obra";
        switch (rubro.cat) {
          case "Materiales":
            ctaNro = "5101001";
            ctaNombre = "Materiales de Obra";
            break;
          case "Subcontratos":
            ctaNro = "5102001";
            ctaNombre = "Subcontratos y Servicios";
            break;
          case "Maquinaria y Equipos":
            ctaNro = "5103001";
            ctaNombre = "Arriendo de Equipos y Maquinarias";
            break;
          case "Mano de Obra":
            ctaNro = "5104001";
            ctaNombre = "Remuneraciones Personal Directo";
            break;
        }
        
        transactions.push({
          "Fecha Cpte": fecha,
          "N° Docto": String(docNumber),
          "Glosa Mov": glosa,
          "debe": debe,
          "haber": haber,
          "saldo": runningBalance,
          "N° Cencos": cenco.id,
          "Nombre Cencos": cenco.nombre,
          "Tipo Cpte.": isCost ? "EG" : "TR",
          "N° Cpte.": String(cpteNumber),
          "N° Cuenta Ctble.": ctaNro,
          "Nombre Cta. Ctble.": ctaNombre
        });
      }
    });
  });
  
  // Ordenar transacciones por fecha
  return transactions.sort((a, b) => new Date(a["Fecha Cpte"]) - new Date(b["Fecha Cpte"]));
};
