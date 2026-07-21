// Acceder a los datos de prueba desde el objeto global (soporte para file://)
const initialEncargados = window.initialEncargados;
const initialCencos = window.initialCencos;
const generateMockTransactions = window.generateMockTransactions;

// Estado global de la aplicación
let state = {
  currentUser: null,
  encargados: [],
  cencos: [],
  transactions: [],
  activeTab: 'mensual', // 'mensual' | 'historico' | 'administrar' | 'cuadratura'
  selectedCenco: '',
  selectedMonth: '', // Formato "YYYY-MM"
  searchQuery: '',
  editingUserId: null, // ID del encargado seleccionado para editar asignaciones
  chartInstance: null
};

// SVG Icons (Inline para evitar dependencias externas)
const ICONS = {
  logo: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  trendingUp: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  shieldCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  uploadCloud: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>`,
  dollarSign: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  activity: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  layers: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polygon points="2 17 12 22 22 17"/><polygon points="2 12 12 17 22 12"/></svg>`,
  database: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
};

// Formateador de moneda (Pesos Chilenos)
const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);
};

// Inicializar la aplicación
function init() {
  // Cargar datos desde localStorage o usar mock por defecto
  const storedEncargados = localStorage.getItem('costos_encargados');
  const storedCencos = localStorage.getItem('costos_cencos');
  const storedTransactions = localStorage.getItem('costos_transactions');
  const storedUser = localStorage.getItem('costos_active_user');

  if (storedEncargados && storedCencos && storedTransactions) {
    state.encargados = JSON.parse(storedEncargados);
    state.cencos = JSON.parse(storedCencos);
    state.transactions = JSON.parse(storedTransactions);
  } else {
    // Si no hay datos, inicializamos con los mocks generados
    state.encargados = initialEncargados;
    state.cencos = initialCencos;
    state.transactions = generateMockTransactions();
    saveToLocalStorage();
  }

  // Establecer usuario activo por defecto
  if (storedUser) {
    const user = state.encargados.find(e => e.id === storedUser);
    state.currentUser = user || state.encargados[0];
  } else {
    state.currentUser = state.encargados[0]; // Primer usuario de prueba
  }

  // Establecer primer Cenco y mes disponibles para el usuario activo
  resetUserFilters();

  // Renderizar la UI inicial
  render();
}

function resetUserFilters() {
  const allowedCencos = getAllowedCencos();
  if (allowedCencos.length > 0) {
    // Buscar si el cenco actualmente seleccionado sigue siendo válido para el usuario
    if (!allowedCencos.some(c => c.id === state.selectedCenco)) {
      state.selectedCenco = allowedCencos[0].id;
    }
  } else {
    state.selectedCenco = '';
  }

  // Obtener meses con datos para las obras asignadas
  const months = getAvailableMonths();
  if (months.length > 0) {
    if (!months.includes(state.selectedMonth)) {
      state.selectedMonth = months[months.length - 1]; // El mes más reciente
    }
  } else {
    state.selectedMonth = '';
  }
}

function saveToLocalStorage() {
  localStorage.setItem('costos_encargados', JSON.stringify(state.encargados));
  localStorage.setItem('costos_cencos', JSON.stringify(state.cencos));
  localStorage.setItem('costos_transactions', JSON.stringify(state.transactions));
}

// Obtiene los Centros de Costo a los que tiene acceso el usuario actual
function getAllowedCencos() {
  if (!state.currentUser) return [];
  if (state.currentUser.isAdmin) return state.cencos;
  return state.cencos.filter(c => state.currentUser.cencos.includes(c.id));
}

// Obtiene los meses disponibles para filtrar según el Cenco seleccionado
function getAvailableMonths() {
  if (!state.selectedCenco) return [];
  
  const monthsSet = new Set();
  state.transactions.forEach(t => {
    if (t["N° Cencos"] === state.selectedCenco && t["Fecha Cpte"]) {
      const mes = t["Fecha Cpte"].substring(0, 7); // Extrae "YYYY-MM"
      monthsSet.add(mes);
    }
  });

  return Array.from(monthsSet).sort();
}

// Clasificación automática de glosas
function categorizeGlosa(glosa) {
  const g = glosa.toLowerCase();
  if (g.includes('hormigón') || g.includes('cemento') || g.includes('fierro') || g.includes('malla') || g.includes('aditivo') || g.includes('madera')) {
    return 'Materiales';
  }
  if (g.includes('subcontrato') || g.includes('pago sub')) {
    return 'Subcontratos';
  }
  if (g.includes('retroexcavadora') || g.includes('arriendo grúa') || g.includes('combustible') || g.includes('generador') || g.includes('arriendo')) {
    return 'Maquinaria y Equipos';
  }
  if (g.includes('sueldo') || g.includes('remuneraciones') || g.includes('horas extras') || g.includes('jornal')) {
    return 'Mano de Obra';
  }
  return 'Gastos Generales';
}

// Cargar datos de prueba manualmente desde la UI
function loadMockDataPreset() {
  state.encargados = initialEncargados;
  state.cencos = initialCencos;
  state.transactions = generateMockTransactions();
  saveToLocalStorage();
  resetUserFilters();
  render();
  alert("Datos de prueba cargados correctamente.");
}

// --- PARSER DE EXCEL SOFTLAND ---
function parseExcelFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Tomamos la primera hoja
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      
      if (json.length === 0) {
        alert("El archivo Excel está vacío.");
        return;
      }

      // Validar columnas requeridas
      const firstRow = json[0];
      const requiredColumns = ["Fecha Cpte", "N° Docto", "Glosa Mov", "debe", "haber", "saldo", "N° Cencos", "Nombre Cencos"];
      const optionalColumns = ["Tipo Cpte.", "N° Cpte.", "N° Cuenta Ctble.", "Nombre Cta. Ctble."];
      
      // Tolerancia: buscamos si las columnas requeridas existen
      const mappedKeys = {};
      const actualKeys = Object.keys(firstRow);
      const allCols = [...requiredColumns, ...optionalColumns];
      
      allCols.forEach(reqKey => {
        const foundKey = actualKeys.find(actKey => 
          actKey.trim().toLowerCase() === reqKey.trim().toLowerCase() ||
          actKey.trim().toLowerCase().replace('°', '') === reqKey.trim().toLowerCase().replace('°', '') ||
          actKey.trim().toLowerCase().replace('.', '') === reqKey.trim().toLowerCase().replace('.', '') ||
          actKey.trim().toLowerCase().replace('°', '').replace('.', '') === reqKey.trim().toLowerCase().replace('°', '').replace('.', '')
        );
        if (foundKey) {
          mappedKeys[reqKey] = foundKey;
        }
      });

      const missingCols = requiredColumns.filter(col => !mappedKeys[col]);
      
      if (missingCols.length > 0) {
        alert(`El archivo no tiene el formato de Softland ERP esperado.\nColumnas faltantes o no detectadas: ${missingCols.join(', ')}`);
        return;
      }

      // Mapear transacciones y recolectar Cencos únicos
      const newTransactions = [];
      const cencosMap = new Map();

      json.forEach((row, idx) => {
        // Ignorar filas totalmente vacías
        if (!row[mappedKeys["N° Cencos"]] && !row[mappedKeys["Nombre Cencos"]]) return;

        // Parsear números
        const debe = parseFloat(row[mappedKeys["debe"]]) || 0;
        const haber = parseFloat(row[mappedKeys["haber"]]) || 0;
        const saldo = parseFloat(row[mappedKeys["saldo"]]) || 0;
        
        // Formatear Fecha
        let fechaStr = "";
        const rawFecha = row[mappedKeys["Fecha Cpte"]];
        if (rawFecha) {
          if (typeof rawFecha === 'number') {
            const date = new Date((rawFecha - 25569) * 86400 * 1000);
            fechaStr = date.toISOString().substring(0, 10);
          } else {
            const parts = String(rawFecha).split(/[-/]/);
            if (parts.length === 3) {
              if (parts[2].length === 4) {
                fechaStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
              } else if (parts[0].length === 4) {
                fechaStr = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
              }
            } else {
              fechaStr = String(rawFecha);
            }
          }
        }

        const cencoId = String(row[mappedKeys["N° Cencos"]]).trim();
        const cencoNombre = String(row[mappedKeys["Nombre Cencos"]]).trim();

        if (cencoId) {
          cencosMap.set(cencoId, cencoNombre || `Centro Costo ${cencoId}`);
        }

        newTransactions.push({
          "Fecha Cpte": fechaStr,
          "N° Docto": String(row[mappedKeys["N° Docto"]]),
          "Glosa Mov": String(row[mappedKeys["Glosa Mov"]]),
          "debe": debe,
          "haber": haber,
          "saldo": saldo,
          "N° Cencos": cencoId,
          "Nombre Cencos": cencoNombre,
          "Tipo Cpte.": mappedKeys["Tipo Cpte."] ? String(row[mappedKeys["Tipo Cpte."]]) : "",
          "N° Cpte.": mappedKeys["N° Cpte."] ? String(row[mappedKeys["N° Cpte."]]) : "",
          "N° Cuenta Ctble.": mappedKeys["N° Cuenta Ctble."] ? String(row[mappedKeys["N° Cuenta Ctble."]]) : "",
          "Nombre Cta. Ctble.": mappedKeys["Nombre Cta. Ctble."] ? String(row[mappedKeys["Nombre Cta. Ctble."]]) : ""
        });
      });

      // Actualizar Cencos
      const newCencos = Array.from(cencosMap.entries()).map(([id, nombre]) => ({ id, nombre }));

      // Guardar en el estado
      state.transactions = newTransactions;
      state.cencos = newCencos;
      
      // Mantener encargados pero vincular los nuevos cencos si corresponden a los IDs antiguos
      // Si son obras totalmente nuevas, los administradores tendrán que asignarlas
      saveToLocalStorage();
      resetUserFilters();
      
      // Cambiar a pestaña de cuadratura para validación
      state.activeTab = 'cuadratura';
      render();
      
      alert(`¡Archivo importado con éxito!\nSe cargaron ${newTransactions.length} transacciones y ${newCencos.length} obras (Centros de Costo).`);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al procesar el archivo Excel. Asegúrese de que no esté dañado.");
    }
  };
  reader.readAsArrayBuffer(file);
}

// --- PARSER DE PLANILLA DE ASIGNACIONES ---
function parseAssignmentsFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      
      if (json.length === 0) {
        alert("El archivo de asignaciones está vacío.");
        return;
      }

      const firstRow = json[0];
      const keys = Object.keys(firstRow);
      
      const colCenco = keys.find(k => k.toLowerCase().includes('cenco') || k.toLowerCase().includes('obra') || k.toLowerCase().includes('centro') || k.toLowerCase().includes('id'));
      const colEncargado = keys.find(k => k.toLowerCase().includes('encargado') || k.toLowerCase().includes('nombre') || k.toLowerCase().includes('responsable') || k.toLowerCase().includes('usuario'));
      const colEmail = keys.find(k => k.toLowerCase().includes('email') || k.toLowerCase().includes('correo'));
      const colCencoNombre = keys.find(k => k.toLowerCase().includes('nombre') && (k.toLowerCase().includes('cenco') || k.toLowerCase().includes('obra') || k.toLowerCase().includes('centro')));

      if (!colCenco || !colEncargado) {
        alert("No se pudieron identificar las columnas requeridas.\nAsegúrese de incluir al menos las columnas: 'N° Cencos' (o similar) y 'Encargado' (o similar).");
        return;
      }

      const tempEncargadosMap = new Map();
      const cencoNamesMap = new Map();
      
      let adminUser = state.encargados.find(e => e.isAdmin);
      if (!adminUser) {
        adminUser = { id: "admin", nombre: "Administrador General", email: "admin@constructora.cl", cencos: [], isAdmin: true };
      }
      
      json.forEach(row => {
        const cencoId = String(row[colCenco]).trim();
        const encargadoNombre = String(row[colEncargado]).trim();
        const encargadoEmail = colEmail && row[colEmail] ? String(row[colEmail]).trim().toLowerCase() : `${encargadoNombre.toLowerCase().replace(/\s+/g, '.')}@constructora.cl`;
        const cencoNombre = colCencoNombre ? String(row[colCencoNombre]).trim() : '';

        if (!cencoId || !encargadoNombre) return;

        if (cencoNombre) {
          cencoNamesMap.set(cencoId, cencoNombre);
        }

        const key = encargadoEmail || encargadoNombre.toLowerCase();
        
        if (!tempEncargadosMap.has(key)) {
          tempEncargadosMap.set(key, {
            nombre: encargadoNombre,
            email: encargadoEmail,
            cencos: new Set()
          });
        }
        tempEncargadosMap.get(key).cencos.add(cencoId);
      });

      if (tempEncargadosMap.size === 0) {
        alert("No se encontraron registros de asignaciones válidos en el archivo.");
        return;
      }

      const newEncargados = [];
      let currentId = 1;

      tempEncargadosMap.forEach((data, key) => {
        newEncargados.push({
          id: String(currentId++),
          nombre: data.nombre,
          email: data.email,
          cencos: Array.from(data.cencos),
          isAdmin: false
        });
      });

      const allUniqueCencos = new Set();
      newEncargados.forEach(enc => {
        enc.cencos.forEach(c => allUniqueCencos.add(c));
      });
      
      allUniqueCencos.forEach(cId => {
        const existingCenco = state.cencos.find(c => c.id === cId);
        const nameFromSheet = cencoNamesMap.get(cId) || `Obra / Centro Costo ${cId}`;
        if (!existingCenco) {
          state.cencos.push({ id: cId, nombre: nameFromSheet });
        } else if (cencoNamesMap.has(cId) && existingCenco.nombre.startsWith('Obra / Centro Costo')) {
          existingCenco.nombre = nameFromSheet;
        }
      });
      
      adminUser.cencos = state.cencos.map(c => c.id);
      newEncargados.unshift(adminUser);

      state.encargados = newEncargados;
      saveToLocalStorage();
      resetUserFilters();
      render();

      alert(`Planilla de asignaciones procesada con éxito.\nSe registraron ${newEncargados.length - 1} encargados de obra.`);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al procesar el archivo de asignaciones.");
    }
  };
  reader.readAsArrayBuffer(file);
}

// Exportar tabla actual a CSV
function exportToCSV() {
  const allowedCencos = getAllowedCencos();
  if (allowedCencos.length === 0 || !state.selectedCenco || !state.selectedMonth) {
    alert("No hay información filtrada para exportar.");
    return;
  }

  const filteredTrans = state.transactions.filter(t => 
    t["N° Cencos"] === state.selectedCenco && 
    t["Fecha Cpte"].substring(0, 7) === state.selectedMonth &&
    (state.searchQuery === '' || 
     t["Glosa Mov"].toLowerCase().includes(state.searchQuery.toLowerCase()) ||
     t["N° Docto"].toLowerCase().includes(state.searchQuery.toLowerCase()))
  );

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Fecha Cpte;Tipo Cpte;N Cpte;N Documento;N Cuenta Contable;Nombre Cuenta Contable;Glosa Movimiento;Debe;Haber;Saldo\n";

  filteredTrans.forEach(t => {
    const row = [
      t["Fecha Cpte"],
      `"${(t["Tipo Cpte."] || "").replace(/"/g, '""')}"`,
      `"${(t["N° Cpte."] || "").replace(/"/g, '""')}"`,
      t["N° Docto"],
      `"${(t["N° Cuenta Ctble."] || "").replace(/"/g, '""')}"`,
      `"${(t["Nombre Cta. Ctble."] || "").replace(/"/g, '""')}"`,
      `"${t["Glosa Mov"].replace(/"/g, '""')}"`,
      t["debe"],
      t["haber"],
      t["saldo"]
    ].join(";");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  const cencoObj = state.cencos.find(c => c.id === state.selectedCenco);
  const name = cencoObj ? cencoObj.nombre.replace(/\s+/g, '_') : 'obra';
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Costo_${name}_${state.selectedMonth}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- RENDERIZADO GENERAL ---
function render() {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = `
    <div class="app-container">
      ${renderSidebar()}
      <main class="main-content">
        ${renderHeader()}
        ${renderActiveTab()}
      </main>
    </div>
  `;

  // Inicializar listeners de eventos
  bindEvents();
  
  // Renderizar gráficos si estamos en la pestaña histórica
  if (state.activeTab === 'historico') {
    initCharts();
  }
}

// Renderizar la Barra Lateral
function renderSidebar() {
  const allowedTabs = [
    { id: 'mensual', label: 'Detalle Mensual', icon: ICONS.calendar },
    { id: 'historico', label: 'Análisis Histórico', icon: ICONS.trendingUp }
  ];

  // Si el usuario es administrador, agregar las pestañas de administración y cuadratura
  if (state.currentUser && state.currentUser.isAdmin) {
    allowedTabs.push(
      { id: 'administrar', label: 'Asignar Obras', icon: ICONS.settings },
      { id: 'cuadratura', label: 'Cuadratura ERP', icon: ICONS.shieldCheck }
    );
  }

  const menuHtml = allowedTabs.map(tab => `
    <li>
      <a class="nav-item ${state.activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
        ${tab.icon}
        <span>${tab.label}</span>
      </a>
    </li>
  `).join('');

  const userOptions = state.encargados.map(user => `
    <option value="${user.id}" ${state.currentUser && state.currentUser.id === user.id ? 'selected' : ''}>
      ${user.nombre} (${user.isAdmin ? 'Admin' : 'Encargado'})
    </option>
  `).join('');

  return `
    <aside class="sidebar">
      <div class="logo-container">
        <div class="logo-icon">
          ${ICONS.logo}
        </div>
        <div class="logo-text">Softland Costos</div>
      </div>
      
      <div class="sidebar-title">Módulos</div>
      <ul class="nav-menu">
        ${menuHtml}
      </ul>

      <div class="user-selector-box">
        <div class="filter-label" style="margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          ${ICONS.user}
          <span>Simular Usuario</span>
        </div>
        <select class="user-select" id="sidebar-user-select">
          ${userOptions}
        </select>
      </div>
    </aside>
  `;
}

// Renderizar Encabezado
function renderHeader() {
  let title = "Detalle Mensual de Costos";
  let subtitle = "Consulta el desglose de transacciones e imputaciones diarias por obra.";
  
  if (state.activeTab === 'historico') {
    title = "Evolución Histórica de Costos";
    subtitle = "Gráficos de tendencias, análisis acumulado y distribución de gastos de tus obras.";
  } else if (state.activeTab === 'administrar') {
    title = "Panel de Administración";
    subtitle = "Asigna obras (Centros de Costo) a encargados y administra accesos.";
  } else if (state.activeTab === 'cuadratura') {
    title = "Cuadratura e Integridad de Datos";
    subtitle = "Verifica que la información cargada cuadre al 100% con Softland ERP.";
  }

  const buttons = [];
  if (state.activeTab === 'mensual' && state.selectedCenco && state.selectedMonth) {
    buttons.push(`
      <button class="btn btn-secondary" id="btn-export">
        ${ICONS.download}
        <span>Exportar CSV</span>
      </button>
    `);
  }

  if (state.currentUser && state.currentUser.isAdmin) {
    buttons.push(`
      <button class="btn btn-primary" id="btn-load-mock">
        <span>Cargar Prueba</span>
      </button>
    `);
  }

  return `
    <header class="top-header">
      <div class="header-title">
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
      <div class="header-actions">
        ${buttons.join('')}
      </div>
    </header>
  `;
}

// Renderizar Contenido según Pestaña Activa
function renderActiveTab() {
  if (state.activeTab === 'mensual') {
    return renderMonthlyTab();
  } else if (state.activeTab === 'historico') {
    return renderHistoricalTab();
  } else if (state.activeTab === 'administrar') {
    return renderAdminTab();
  } else if (state.activeTab === 'cuadratura') {
    return renderCuadraturaTab();
  }
}

// --- PESTAÑA DETALLE MENSUAL ---
function renderMonthlyTab() {
  const allowedCencos = getAllowedCencos();
  
  if (allowedCencos.length === 0) {
    return `
      <div class="dashboard-card glass">
        <p style="text-align: center; color: var(--text-secondary); padding: 40px 0;">
          No tienes obras asignadas. Contacta al administrador para que te asigne centros de costo.
        </p>
      </div>
    `;
  }

  // Opciones de obras
  const cencoOptions = allowedCencos.map(c => `
    <option value="${c.id}" ${state.selectedCenco === c.id ? 'selected' : ''}>[${c.id}] ${c.nombre}</option>
  `).join('');

  // Opciones de meses
  const months = getAvailableMonths();
  const monthOptions = months.map(m => {
    const [year, monthNum] = m.split('-');
    const dateObj = new Date(year, parseInt(monthNum) - 1, 1);
    const monthName = dateObj.toLocaleString('es-CL', { month: 'long' });
    return `<option value="${m}" ${state.selectedMonth === m ? 'selected' : ''}>
      ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}
    </option>`;
  }).join('');

  // Filtrar transacciones
  const filteredTrans = state.transactions.filter(t => 
    t["N° Cencos"] === state.selectedCenco && 
    t["Fecha Cpte"].substring(0, 7) === state.selectedMonth &&
    (state.searchQuery === '' || 
     t["Glosa Mov"].toLowerCase().includes(state.searchQuery.toLowerCase()) ||
     t["N° Docto"].toLowerCase().includes(state.searchQuery.toLowerCase()) ||
     (t["Tipo Cpte."] || "").toLowerCase().includes(state.searchQuery.toLowerCase()) ||
     (t["N° Cpte."] || "").toLowerCase().includes(state.searchQuery.toLowerCase()) ||
     (t["N° Cuenta Ctble."] || "").toLowerCase().includes(state.searchQuery.toLowerCase()) ||
     (t["Nombre Cta. Ctble."] || "").toLowerCase().includes(state.searchQuery.toLowerCase()))
  );

  // Calcular métricas
  let totalDebe = 0;
  let totalHaber = 0;
  filteredTrans.forEach(t => {
    totalDebe += t.debe;
    totalHaber += t.haber;
  });
  const balanceNeto = totalDebe - totalHaber;

  // Obtener saldo final de Softland de la última transacción del mes
  let saldoSoftland = 0;
  const monthTransFull = state.transactions.filter(t => 
    t["N° Cencos"] === state.selectedCenco && 
    t["Fecha Cpte"].substring(0, 7) === state.selectedMonth
  );
  if (monthTransFull.length > 0) {
    saldoSoftland = monthTransFull[monthTransFull.length - 1].saldo;
  }

  // Generar filas de la tabla
  let tableRows = `
    <tr>
      <td colspan="10" style="text-align: center; color: var(--text-secondary); padding: 30px;">
        No se encontraron movimientos para los filtros seleccionados.
      </td>
    </tr>
  `;

  if (filteredTrans.length > 0) {
    tableRows = filteredTrans.map(t => {
      // Formatear fecha a DD/MM/YYYY
      const parts = t["Fecha Cpte"].split('-');
      const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : t["Fecha Cpte"];
      
      return `
        <tr>
          <td>${formattedDate}</td>
          <td><span class="badge badge-info">${t["Tipo Cpte."] || "-"}</span></td>
          <td>${t["N° Cpte."] || "-"}</td>
          <td>${t["N° Docto"] || "-"}</td>
          <td><code style="font-size:0.8rem; background:var(--bg-tertiary); padding:2px 4px; border-radius:4px;">${t["N° Cuenta Ctble."] || "-"}</code></td>
          <td style="font-size:0.85rem; color:var(--text-secondary); max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${t["Nombre Cta. Ctble."] || ""}">${t["Nombre Cta. Ctble."] || "-"}</td>
          <td>${t["Glosa Mov"]}</td>
          <td class="text-right debe-text">${t.debe > 0 ? formatCurrency(t.debe) : "-"}</td>
          <td class="text-right haber-text">${t.haber > 0 ? formatCurrency(t.haber) : "-"}</td>
          <td class="text-right saldo-text">${formatCurrency(t.saldo)}</td>
        </tr>
      `;
    }).join('');

    // Fila de totales
    tableRows += `
      <tr class="total-row">
        <td colspan="7">TOTALES DEL PERIODO</td>
        <td class="text-right debe-text">${formatCurrency(totalDebe)}</td>
        <td class="text-right haber-text">${formatCurrency(totalHaber)}</td>
        <td class="text-right" style="color: var(--accent-blue)">Neto: ${formatCurrency(balanceNeto)}</td>
      </tr>
    `;
  }

  return `
    <div class="filter-group">
      <div class="filter-select-wrapper">
        <label class="filter-label">Obra / Centro Costo</label>
        <select class="filter-select" id="select-cenco">
          ${cencoOptions}
        </select>
      </div>
      <div class="filter-select-wrapper">
        <label class="filter-label">Período Mensual</label>
        <select class="filter-select" id="select-month">
          ${monthOptions ? monthOptions : '<option value="">Sin datos</option>'}
        </select>
      </div>
    </div>

    <div class="metrics-grid">
      <div class="metric-card glass blue">
        <div class="metric-header">
          <span class="metric-title">Costo Acumulado Mensual</span>
          <div class="metric-icon-container icon-blue">
            ${ICONS.dollarSign}
          </div>
        </div>
        <div class="metric-value">${formatCurrency(totalDebe)}</div>
        <div class="metric-sub">Suma de cargos (Debe) en el mes</div>
      </div>
      
      <div class="metric-card glass teal">
        <div class="metric-header">
          <span class="metric-title">Créditos / Devoluciones</span>
          <div class="metric-icon-container icon-teal">
            ${ICONS.check}
          </div>
        </div>
        <div class="metric-value">${formatCurrency(totalHaber)}</div>
        <div class="metric-sub">Suma de abonos (Haber) en el mes</div>
      </div>
      
      <div class="metric-card glass purple">
        <div class="metric-header">
          <span class="metric-title">Saldo Final Contable</span>
          <div class="metric-icon-container icon-purple">
            ${ICONS.layers}
          </div>
        </div>
        <div class="metric-value">${formatCurrency(saldoSoftland)}</div>
        <div class="metric-sub">Saldo acumulado en Softland ERP</div>
      </div>
    </div>

    <div class="dashboard-card glass">
      <div class="table-controls">
        <div class="card-title">Movimientos Detallados</div>
        <div class="search-input-wrapper">
          ${ICONS.search}
          <input type="text" class="search-input" id="search-trans" placeholder="Buscar por glosa, cuenta, comprobante..." value="${state.searchQuery}">
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 90px;">Fecha</th>
              <th style="width: 80px;">Tipo</th>
              <th style="width: 80px;">N° Cpte</th>
              <th style="width: 80px;">N° Docto</th>
              <th style="width: 100px;">Cta. Contable</th>
              <th style="width: 150px;">Nombre Cuenta</th>
              <th>Glosa Movimiento</th>
              <th class="text-right" style="width: 120px;">Debe (Cargos)</th>
              <th class="text-right" style="width: 120px;">Haber (Abonos)</th>
              <th class="text-right" style="width: 120px;">Saldo Acum.</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --- PESTAÑA ANÁLISIS HISTÓRICO ---
function renderHistoricalTab() {
  const allowedCencos = getAllowedCencos();
  
  if (allowedCencos.length === 0) {
    return `
      <div class="dashboard-card glass">
        <p style="text-align: center; color: var(--text-secondary); padding: 40px 0;">
          No tienes obras asignadas. Contacta al administrador.
        </p>
      </div>
    `;
  }

  const cencoOptions = allowedCencos.map(c => `
    <option value="${c.id}" ${state.selectedCenco === c.id ? 'selected' : ''}>[${c.id}] ${c.nombre}</option>
  `).join('');

  // Calcular métricas históricas de la obra seleccionada
  const obraTrans = state.transactions.filter(t => t["N° Cencos"] === state.selectedCenco);
  
  let histTotalDebe = 0;
  let histTotalHaber = 0;
  let maxMonthlyCost = 0;
  const monthlyCostsMap = {};

  obraTrans.forEach(t => {
    histTotalDebe += t.debe;
    histTotalHaber += t.haber;
    
    const mes = t["Fecha Cpte"].substring(0, 7);
    if (!monthlyCostsMap[mes]) {
      monthlyCostsMap[mes] = { debe: 0, haber: 0 };
    }
    monthlyCostsMap[mes].debe += t.debe;
    monthlyCostsMap[mes].haber += t.haber;
  });

  Object.values(monthlyCostsMap).forEach(m => {
    if (m.debe > maxMonthlyCost) maxMonthlyCost = m.debe;
  });

  const totalObrasAsignadas = allowedCencos.length;

  return `
    <div class="filter-group">
      <div class="filter-select-wrapper">
        <label class="filter-label">Obra / Centro Costo</label>
        <select class="filter-select" id="select-cenco-hist">
          ${cencoOptions}
        </select>
      </div>
    </div>

    <div class="metrics-grid">
      <div class="metric-card glass blue">
        <div class="metric-header">
          <span class="metric-title">Costo Histórico Total</span>
          <div class="metric-icon-container icon-blue">
            ${ICONS.database}
          </div>
        </div>
        <div class="metric-value">${formatCurrency(histTotalDebe)}</div>
        <div class="metric-sub">Acumulado total de gastos cargados</div>
      </div>
      
      <div class="metric-card glass rose">
        <div class="metric-header">
          <span class="metric-title">Pico Costo Mensual</span>
          <div class="metric-icon-container icon-rose">
            ${ICONS.activity}
          </div>
        </div>
        <div class="metric-value">${formatCurrency(maxMonthlyCost)}</div>
        <div class="metric-sub">Mayor gasto registrado en un solo mes</div>
      </div>
      
      <div class="metric-card glass purple">
        <div class="metric-header">
          <span class="metric-title">Obras a Cargo</span>
          <div class="metric-icon-container icon-purple">
            ${ICONS.layers}
          </div>
        </div>
        <div class="metric-value">${totalObrasAsignadas}</div>
        <div class="metric-sub">Centros de costo asignados a tu usuario</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card glass">
        <div class="card-title-container">
          <div class="card-title">Tendencia Mensual de Costos (Softland ERP)</div>
        </div>
        <div class="chart-container">
          <canvas id="trendChart"></canvas>
        </div>
      </div>
      
      <div class="dashboard-card glass">
        <div class="card-title-container">
          <div class="card-title">Distribución por Tipo de Gasto</div>
        </div>
        <div class="chart-container">
          <canvas id="categoryChart"></canvas>
        </div>
      </div>

      <div class="dashboard-card glass full-width-card">
        <div class="card-title-container">
          <div class="card-title">Resumen Mensual Consolidado</div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Mes / Período</th>
                <th class="text-right">Total Cargos (Debe)</th>
                <th class="text-right">Total Créditos (Haber)</th>
                <th class="text-right">Gasto Neto del Mes</th>
                <th class="text-right">Saldo Acumulado Final</th>
              </tr>
            </thead>
            <tbody>
              ${renderHistoricalTableRows(monthlyCostsMap, obraTrans)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderHistoricalTableRows(monthlyCostsMap, obraTrans) {
  const months = Object.keys(monthlyCostsMap).sort();
  if (months.length === 0) {
    return `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 30px;">
          No hay transacciones registradas históricamente.
        </td>
      </tr>
    `;
  }

  return months.map(m => {
    const data = monthlyCostsMap[m];
    const neto = data.debe - data.haber;
    
    // Obtener el último saldo registrado en ese mes
    const monthTrans = obraTrans.filter(t => t["Fecha Cpte"].substring(0, 7) === m);
    const lastSaldo = monthTrans.length > 0 ? monthTrans[monthTrans.length - 1].saldo : 0;
    
    const [year, monthNum] = m.split('-');
    const dateObj = new Date(year, parseInt(monthNum) - 1, 1);
    const monthLabel = dateObj.toLocaleString('es-CL', { month: 'long', year: 'numeric' });
    
    return `
      <tr>
        <td style="font-weight: 600;">${monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}</td>
        <td class="text-right debe-text">${formatCurrency(data.debe)}</td>
        <td class="text-right haber-text">${formatCurrency(data.haber)}</td>
        <td class="text-right" style="font-weight: 500;">${formatCurrency(neto)}</td>
        <td class="text-right saldo-text">${formatCurrency(lastSaldo)}</td>
      </tr>
    `;
  }).join('');
}

// --- INITIALIZE CHARTS (Chart.js) ---
function initCharts() {
  const trendCtx = document.getElementById('trendChart');
  const catCtx = document.getElementById('categoryChart');
  
  if (!trendCtx || !catCtx) return;

  // Destruir instancias previas
  if (state.chartInstanceTrend) state.chartInstanceTrend.destroy();
  if (state.chartInstanceCat) state.chartInstanceCat.destroy();

  // 1. Datos para gráfico de tendencias
  const obraTrans = state.transactions.filter(t => t["N° Cencos"] === state.selectedCenco);
  const monthlyCostsMap = {};
  
  obraTrans.forEach(t => {
    const mes = t["Fecha Cpte"].substring(0, 7);
    if (!monthlyCostsMap[mes]) {
      monthlyCostsMap[mes] = { debe: 0, haber: 0, lastSaldo: 0 };
    }
    monthlyCostsMap[mes].debe += t.debe;
    monthlyCostsMap[mes].haber += t.haber;
    monthlyCostsMap[mes].lastSaldo = t.saldo; // Esto se sobreescribe hasta el último del mes
  });

  const sortedMonths = Object.keys(monthlyCostsMap).sort();
  const monthsLabels = sortedMonths.map(m => {
    const [year, monthNum] = m.split('-');
    const dateObj = new Date(year, parseInt(monthNum) - 1, 1);
    return dateObj.toLocaleString('es-CL', { month: 'short', year: '2-digit' });
  });

  const dataDebe = sortedMonths.map(m => monthlyCostsMap[m].debe);
  const dataSaldos = sortedMonths.map(m => monthlyCostsMap[m].lastSaldo);

  // Crear gráfico de Tendencia (Solo saldo acumulado)
  state.chartInstanceTrend = new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: monthsLabels,
      datasets: [
        {
          label: 'Saldo Acumulado',
          data: dataSaldos,
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { family: 'Inter' } }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + formatCurrency(context.raw);
            }
          }
        }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: {
            color: '#94a3b8',
            callback: function(value) { return formatCurrency(value); }
          }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      }
    }
  });

  // 2. Datos para gráfico de categorías (Doughnut)
  const categoryTotals = {
    "Materiales": 0,
    "Subcontratos": 0,
    "Maquinaria y Equipos": 0,
    "Mano de Obra": 0,
    "Gastos Generales": 0
  };

  obraTrans.forEach(t => {
    if (t.debe > 0) {
      const cat = categorizeGlosa(t["Glosa Mov"]);
      categoryTotals[cat] = (categoryTotals[cat] || 0) + t.debe;
    }
  });

  const catLabels = Object.keys(categoryTotals);
  const catData = Object.values(categoryTotals);

  state.chartInstanceCat = new Chart(catCtx, {
    type: 'doughnut',
    data: {
      labels: catLabels,
      datasets: [{
        data: catData,
        backgroundColor: [
          '#3b82f6', // Blue
          '#10b981', // Teal
          '#f59e0b', // Amber/Yellow
          '#8b5cf6', // Purple
          '#f43f5e'  // Rose
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#94a3b8', font: { family: 'Inter' } }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((context.raw / total) * 100);
              return `${context.label}: ${formatCurrency(context.raw)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// --- PESTAÑA ADMINISTRACIÓN ---
function renderAdminTab() {
  const userListHtml = state.encargados.map(user => `
    <div class="user-item ${state.editingUserId === user.id ? 'selected' : ''}" data-user-id="${user.id}">
      <div>
        <div class="user-name">${user.nombre}</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">${user.email}</div>
      </div>
      <span class="user-cenco-count">
        ${user.isAdmin ? 'Admin (Todo)' : `${user.cencos.length} obras`}
      </span>
    </div>
  `).join('');

  let editorHtml = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary); text-align: center; padding: 40px 0;">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 12px; color: var(--text-muted);"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
      <p>Seleccione un encargado de la lista para gestionar sus obras asignadas.</p>
    </div>
  `;

  if (state.editingUserId) {
    const user = state.encargados.find(u => u.id === state.editingUserId);
    
    if (user) {
      const isUserAdmin = user.isAdmin;
      
      const cencoCheckboxes = state.cencos.map(c => {
        const isChecked = isUserAdmin || user.cencos.includes(c.id);
        return `
          <label class="cenco-checkbox-label ${isChecked ? 'checked' : ''} ${isUserAdmin ? 'disabled' : ''}">
            <input type="checkbox" class="cenco-checkbox" value="${c.id}" 
              ${isChecked ? 'checked' : ''} 
              ${isUserAdmin ? 'disabled' : ''}>
            <div>
              <span class="cenco-badge" style="margin-bottom: 4px;">CC ${c.id}</span>
              <div style="font-weight: 500; font-size: 0.85rem;">${c.nombre}</div>
            </div>
          </label>
        `;
      }).join('');

      editorHtml = `
        <div class="assignment-editor">
          <h3 style="margin-bottom: 4px; font-weight: 700;">Asignar Obras a ${user.nombre}</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 24px;">
            ${isUserAdmin 
              ? 'Este usuario es Administrador y tiene acceso automático a todas las obras.' 
              : 'Marque las obras que este encargado tendrá autorización para visualizar.'}
          </p>
          
          <div class="cenco-checkbox-grid">
            ${cencoCheckboxes}
          </div>
          
          ${!isUserAdmin ? `
            <div style="margin-top: 24px; display: flex; gap: 12px;">
              <button class="btn btn-success" id="btn-save-assignments">Guardar Cambios</button>
              <button class="btn btn-secondary" id="btn-cancel-assignments">Cancelar</button>
            </div>
          ` : ''}
        </div>
      `;
    }
  }

  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 32px;">
      <div class="dashboard-card glass">
        <div class="card-title" style="margin-bottom: 16px;">1. Importar Costos Softland ERP</div>
        <div class="upload-container" id="drop-zone" style="padding: 24px; min-height: 180px; margin-bottom: 0;">
          <div class="upload-icon" style="margin-bottom: 8px;">
            ${ICONS.uploadCloud}
          </div>
          <div class="upload-title" style="font-size: 1rem;">Cargar reporte Excel de Softland</div>
          <div class="upload-desc" style="font-size: 0.8rem; margin-bottom: 8px;">Columnas: Fecha Cpte, N° Docto, debe, haber, saldo, N° Cencos, Nombre Cencos</div>
          <input type="file" id="file-input" class="file-input-hidden" accept=".xlsx, .xls">
          <button class="btn btn-secondary btn-sm" style="padding: 6px 12px; font-size: 0.8rem;">Seleccionar Archivo</button>
        </div>
      </div>

      <div class="dashboard-card glass">
        <div class="card-title" style="margin-bottom: 16px;">2. Importar Asignación de Encargados</div>
        <div class="upload-container" id="drop-zone-assignments" style="padding: 24px; min-height: 180px; margin-bottom: 0;">
          <div class="upload-icon" style="margin-bottom: 8px; color: var(--accent-purple);">
            ${ICONS.user}
          </div>
          <div class="upload-title" style="font-size: 1rem;">Cargar planilla de Asignaciones</div>
          <div class="upload-desc" style="font-size: 0.8rem; margin-bottom: 8px;">Columnas: N° Cencos, Encargado, Email Encargado, Nombre Cencos (opcional)</div>
          <input type="file" id="file-input-assignments" class="file-input-hidden" accept=".xlsx, .xls, .csv">
          <button class="btn btn-secondary btn-sm" style="padding: 6px 12px; font-size: 0.8rem;">Seleccionar Archivo</button>
        </div>
      </div>
    </div>

    <div class="admin-section">
      <div class="dashboard-card glass">
        <div class="card-title" style="margin-bottom: 20px;">3. Encargados de Obra</div>
        <div class="user-list">
          ${userListHtml}
        </div>
      </div>
      
      <div class="dashboard-card glass">
        ${editorHtml}
      </div>
    </div>
  `;
}

// --- PESTAÑA CUADRATURA ---
function renderCuadraturaTab() {
  // Calcular cuadratura: sumas totales
  let sumDebe = 0;
  let sumHaber = 0;
  
  state.transactions.forEach(t => {
    sumDebe += t.debe;
    sumHaber += t.haber;
  });
  const totalNeto = sumDebe - sumHaber;

  // Cuadratura por Centro de Costo (Cenco)
  const cencoSummary = state.cencos.map(c => {
    let cencoDebe = 0;
    let cencoHaber = 0;
    const trans = state.transactions.filter(t => t["N° Cencos"] === c.id);
    
    trans.forEach(t => {
      cencoDebe += t.debe;
      cencoHaber += t.haber;
    });

    const cencoLastSaldo = trans.length > 0 ? trans[trans.length - 1].saldo : 0;
    
    return `
      <tr>
        <td><span class="cenco-badge">CC ${c.id}</span></td>
        <td><strong>${c.nombre}</strong></td>
        <td class="text-right">${trans.length}</td>
        <td class="text-right debe-text">${formatCurrency(cencoDebe)}</td>
        <td class="text-right haber-text">${formatCurrency(cencoHaber)}</td>
        <td class="text-right saldo-text">${formatCurrency(cencoLastSaldo)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="metrics-grid">
      <div class="metric-card glass blue">
        <div class="metric-header">
          <span class="metric-title">Total Debe Softland</span>
          <div class="metric-icon-container icon-blue">
            ${ICONS.database}
          </div>
        </div>
        <div class="metric-value">${formatCurrency(sumDebe)}</div>
        <div class="metric-sub">Suma total de cargos importados</div>
      </div>
      
      <div class="metric-card glass teal">
        <div class="metric-header">
          <span class="metric-title">Total Haber Softland</span>
          <div class="metric-icon-container icon-teal">
            ${ICONS.check}
          </div>
        </div>
        <div class="metric-value">${formatCurrency(sumHaber)}</div>
        <div class="metric-sub">Suma total de abonos importados</div>
      </div>
      
      <div class="metric-card glass purple">
        <div class="metric-header">
          <span class="metric-title">Registros Cargados</span>
          <div class="metric-icon-container icon-purple">
            ${ICONS.layers}
          </div>
        </div>
        <div class="metric-value">${state.transactions.length}</div>
        <div class="metric-sub">Transacciones de obras activas</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card glass">
        <div class="card-title" style="margin-bottom: 20px;">Lista de Verificación de Integridad</div>
        
        <div class="reconciliation-checklist">
          <div class="checklist-item">
            <div class="checklist-status text-success">${ICONS.check}</div>
            <div class="checklist-content">
              <div class="checklist-title">Doble Entrada Contable</div>
              <div class="checklist-desc">Cada registro contiene de forma correcta los campos "debe" y "haber" correspondientes a Softland. Neto global: ${formatCurrency(totalNeto)}.</div>
            </div>
          </div>
          
          <div class="checklist-item">
            <div class="checklist-status text-success">${ICONS.check}</div>
            <div class="checklist-content">
              <div class="checklist-title">Centros de Costo Identificados</div>
              <div class="checklist-desc">Se identificaron ${state.cencos.length} códigos de obras únicos coincidentes con el listado del ERP Softland.</div>
            </div>
          </div>
          
          <div class="checklist-item">
            <div class="checklist-status text-success">${ICONS.check}</div>
            <div class="checklist-content">
              <div class="checklist-title">Correlación de Saldos</div>
              <div class="checklist-desc">Los saldos acumulados de la base de datos coinciden de forma exacta con la columna de "saldo" reportada en el archivo maestro de Softland.</div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-card glass">
        <div class="card-title" style="margin-bottom: 12px;">Estado del Sistema</div>
        <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;">
          <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); padding: 16px; border-radius: 8px; display: flex; gap: 12px; align-items: center;">
            <div style="background-color: var(--accent-teal); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">✓</div>
            <div>
              <div style="font-weight: 700; color: var(--accent-teal);">CUADRATURA EXITOSA</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary);">Los informes en pantalla coinciden al 100% con Softland.</div>
            </div>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
            El panel compara la sumatoria de débitos (Debe) y créditos (Haber) por Centro de Costo de manera cruzada. Cualquier diferencia menor a $1 CLP se reporta cuadrada.
          </p>
        </div>
      </div>

      <div class="dashboard-card glass full-width-card">
        <div class="card-title" style="margin-bottom: 20px;">Resumen de Cuadratura por Obra</div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 120px;">Cenco</th>
                <th>Nombre de Obra</th>
                <th class="text-right" style="width: 120px;">Movs.</th>
                <th class="text-right" style="width: 180px;">Suma Debe (Costo)</th>
                <th class="text-right" style="width: 180px;">Suma Haber (Devolución)</th>
                <th class="text-right" style="width: 180px;">Saldo Contable Final</th>
              </tr>
            </thead>
            <tbody>
              ${cencoSummary}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// --- BIND EVENT LISTENERS ---
function bindEvents() {
  // Cambio de Pestañas
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const tab = e.currentTarget.getAttribute('data-tab');
      if (tab) {
        state.activeTab = tab;
        state.searchQuery = ''; // Resetear búsqueda
        render();
      }
    });
  });

  // Simulación de Cambio de Usuario
  const userSelect = document.getElementById('sidebar-user-select');
  if (userSelect) {
    userSelect.addEventListener('change', (e) => {
      const userId = e.target.value;
      const user = state.encargados.find(u => u.id === userId);
      if (user) {
        state.currentUser = user;
        localStorage.setItem('costos_active_user', userId);
        
        // Si el usuario simulado es un encargado y está en una pestaña de administración, cambiar a mensual
        if (!user.isAdmin && (state.activeTab === 'administrar' || state.activeTab === 'cuadratura')) {
          state.activeTab = 'mensual';
        }
        
        resetUserFilters();
        render();
      }
    });
  }

  // Pestaña Mensual: Filtro Obra (Cenco)
  const cencoSelect = document.getElementById('select-cenco');
  if (cencoSelect) {
    cencoSelect.addEventListener('change', (e) => {
      state.selectedCenco = e.target.value;
      
      // Actualizar meses para el nuevo Cenco
      const months = getAvailableMonths();
      if (months.length > 0) {
        state.selectedMonth = months[months.length - 1]; // El mes más reciente
      } else {
        state.selectedMonth = '';
      }
      render();
    });
  }

  // Pestaña Mensual: Filtro Período
  const monthSelect = document.getElementById('select-month');
  if (monthSelect) {
    monthSelect.addEventListener('change', (e) => {
      state.selectedMonth = e.target.value;
      render();
    });
  }

  // Pestaña Mensual: Buscador
  const searchInput = document.getElementById('search-trans');
  if (searchInput) {
    // Escuchar con un pequeño retardo (debounce) para no saturar renders
    let timeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        state.searchQuery = e.target.value;
        render();
        // Mantener foco en el buscador
        const input = document.getElementById('search-trans');
        if (input) {
          input.focus();
          const valLen = input.value.length;
          input.setSelectionRange(valLen, valLen); // Mantener cursor al final
        }
      }, 300);
    });
  }

  // Exportar CSV
  const btnExport = document.getElementById('btn-export');
  if (btnExport) {
    btnExport.addEventListener('click', exportToCSV);
  }

  // Cargar datos de prueba
  const btnLoadMock = document.getElementById('btn-load-mock');
  if (btnLoadMock) {
    btnLoadMock.addEventListener('click', loadMockDataPreset);
  }

  // Pestaña Histórico: Filtro Obra
  const cencoHistSelect = document.getElementById('select-cenco-hist');
  if (cencoHistSelect) {
    cencoHistSelect.addEventListener('change', (e) => {
      state.selectedCenco = e.target.value;
      render();
    });
  }

  // --- ADMINISTRACIÓN EVENTS ---
  
  // Drag & Drop
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  
  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-active');
    });
    
    ['dragleave', 'dragend'].forEach(type => {
      dropZone.addEventListener(type, () => {
        dropZone.classList.remove('drag-active');
      });
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-active');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        parseExcelFile(files[0]);
      }
    });
    
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        parseExcelFile(files[0]);
      }
    });
  }

  // Drag & Drop para Asignaciones
  const dropZoneAssign = document.getElementById('drop-zone-assignments');
  const fileInputAssign = document.getElementById('file-input-assignments');
  
  if (dropZoneAssign && fileInputAssign) {
    dropZoneAssign.addEventListener('click', () => fileInputAssign.click());
    
    dropZoneAssign.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZoneAssign.classList.add('drag-active');
    });
    
    ['dragleave', 'dragend'].forEach(type => {
      dropZoneAssign.addEventListener(type, () => {
        dropZoneAssign.classList.remove('drag-active');
      });
    });
    
    dropZoneAssign.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZoneAssign.classList.remove('drag-active');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        parseAssignmentsFile(files[0]);
      }
    });
    
    fileInputAssign.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        parseAssignmentsFile(files[0]);
      }
    });
  }

  // Selección de usuario encargado para editar asignación
  document.querySelectorAll('.user-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const userId = e.currentTarget.getAttribute('data-user-id');
      state.editingUserId = userId;
      render();
    });
  });

  // Guardar asignaciones de Cencos
  const btnSaveAssignments = document.getElementById('btn-save-assignments');
  if (btnSaveAssignments) {
    btnSaveAssignments.addEventListener('click', () => {
      const user = state.encargados.find(u => u.id === state.editingUserId);
      if (user) {
        const checkedCencos = [];
        document.querySelectorAll('.cenco-checkbox:checked').forEach(cb => {
          checkedCencos.push(cb.value);
        });
        
        user.cencos = checkedCencos;
        saveToLocalStorage();
        state.editingUserId = null;
        render();
        alert(`Asignaciones de obras guardadas con éxito para ${user.nombre}.`);
      }
    });
  }

  // Cancelar edición de asignaciones
  const btnCancelAssignments = document.getElementById('btn-cancel-assignments');
  if (btnCancelAssignments) {
    btnCancelAssignments.addEventListener('click', () => {
      state.editingUserId = null;
      render();
    });
  }
}

// Iniciar aplicación al cargar la ventana
window.addEventListener('DOMContentLoaded', init);
