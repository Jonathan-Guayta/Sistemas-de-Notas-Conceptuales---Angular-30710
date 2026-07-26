// Catálogos institucionales usados en los selectores del Anexo 1.
// Se pueden ampliar sin tocar el resto de la aplicación.

export const SEDES: string[] = [
  'ESPE Sangolquí',
  'ESPE Latacunga',
  'ESPE Santo Domingo',
  'IASA I',
  'IASA II',
];

export const DEPARTAMENTOS: string[] = [
  'Ciencias de la Computación',
  'Ciencias de la Vida y la Agricultura',
  'Ciencias Económicas, Administrativas y de Comercio',
  'Ciencias Exactas',
  'Eléctrica y Electrónica',
  'Energía y Mecánica',
  'Seguridad y Defensa',
  'Ciencias Humanas y Sociales',
];

export interface AmbitoPrioritario {
  clave: 'desarrolloTerritorial' | 'sostenibilidadAmbiental' | 'innovacionSocial';
  nombre: string;
  definicion: string;
}

export const AMBITOS_PRIORITARIOS: AmbitoPrioritario[] = [
  {
    clave: 'desarrolloTerritorial',
    nombre: 'Desarrollo Territorial y Fortalecimiento Comunitario',
    definicion:
      'Soluciones participativas que impulsen la gobernanza, inclusión social, desarrollo sostenible y el fortalecimiento de capacidades locales.',
  },
  {
    clave: 'sostenibilidadAmbiental',
    nombre: 'Sostenibilidad Ambiental y Green University',
    definicion:
      'Gestión responsable de recursos y prácticas ambientales sostenibles alineadas con los ODS y la estrategia institucional de campus verde.',
  },
  {
    clave: 'innovacionSocial',
    nombre: 'Innovación Social y Resiliencia Territorial',
    definicion:
      'Proyectos enfocados en la transformación digital, apropiación del conocimiento, adaptación al riesgo y resiliencia comunitaria frente a cambios del entorno.',
  },
];

export const COBERTURAS: string[] = [
  'Internacional',
  'Nacional',
  'Provincial',
  'Cantonal',
  'Parroquial',
  'Barrio o comunidad',
];

export const ODS: Record<string, string[]> = {
  'ODS 1. Fin de la pobreza': ['1.2 Reducir la pobreza en todas sus formas', '1.4 Igualdad de derechos a recursos económicos'],
  'ODS 2. Hambre cero': ['2.3 Duplicar la productividad y los ingresos de pequeños productores', '2.4 Sistemas alimentarios sostenibles'],
  'ODS 3. Salud y bienestar': ['3.4 Reducir enfermedades no transmisibles y promover salud mental', '3.8 Cobertura sanitaria universal'],
  'ODS 4. Educación de calidad': ['4.4 Aumentar competencias para empleo y emprendimiento', '4.7 Educación para el desarrollo sostenible'],
  'ODS 5. Igualdad de género': ['5.1 Poner fin a la discriminación', '5.5 Participación plena de la mujer'],
  'ODS 6. Agua limpia y saneamiento': ['6.3 Mejorar la calidad del agua', '6.4 Uso eficiente de los recursos hídricos'],
  'ODS 7. Energía asequible y no contaminante': ['7.2 Aumentar la proporción de energía renovable', '7.3 Duplicar la eficiencia energética'],
  'ODS 8. Trabajo decente y crecimiento económico': ['8.3 Promover políticas orientadas al desarrollo y el emprendimiento', '8.6 Reducir el desempleo juvenil'],
  'ODS 9. Industria, innovación e infraestructura': ['9.1 Desarrollar infraestructuras fiables y sostenibles', '9.5 Fomentar la investigación e innovación'],
  'ODS 10. Reducción de las desigualdades': ['10.2 Promover la inclusión social, económica y política', '10.3 Garantizar la igualdad de oportunidades'],
  'ODS 11. Ciudades y comunidades sostenibles': ['11.3 Urbanización inclusiva y sostenible', '11.a Vínculos urbano-rurales positivos'],
  'ODS 12. Producción y consumo responsables': ['12.5 Reducir la generación de desechos', '12.8 Información y conciencia sobre el desarrollo sostenible'],
  'ODS 13. Acción por el clima': ['13.1 Fortalecer la resiliencia y adaptación', '13.3 Mejorar la educación sobre cambio climático'],
  'ODS 14. Vida submarina': ['14.2 Gestionar y proteger ecosistemas marinos', '14.5 Conservar zonas costeras y marinas'],
  'ODS 15. Vida de ecosistemas terrestres': ['15.1 Conservar y restaurar ecosistemas terrestres', '15.5 Reducir la degradación de hábitats naturales'],
  'ODS 16. Paz, justicia e instituciones sólidas': ['16.1 Reducir la violencia y las tasas de mortalidad', '16.6 Crear instituciones eficaces y transparentes'],
  'ODS 17. Alianzas para lograr los objetivos': ['17.14 Mejorar la coherencia de las políticas', '17.17 Fomentar alianzas eficaces'],
};

export const CINE: Record<string, Record<string, string[]>> = {
  'Educación': {
    'Formación de docentes': ['Formación de docentes de educación básica', 'Formación de docentes de educación media'],
  },
  'Ingeniería, industria y construcción': {
    'Ingeniería y profesiones afines': ['Ingeniería civil', 'Ingeniería electrónica y automatización'],
    'Industria y producción': ['Procesamiento de alimentos', 'Textiles, confección y calzado'],
  },
  'Ciencias naturales, matemáticas y estadística': {
    'Medio ambiente': ['Ciencias del medio ambiente', 'Gestión de recursos naturales'],
  },
  'Agricultura, silvicultura, pesca y veterinaria': {
    'Agricultura': ['Producción agropecuaria', 'Agroecología'],
  },
  'Ciencias sociales, periodismo e información': {
    'Ciencias sociales y del comportamiento': ['Trabajo social y orientación', 'Economía'],
  },
  'Tecnologías de la información y la comunicación': {
    'Tecnologías de la información y la comunicación': ['Diseño y administración de bases de datos y redes', 'Desarrollo de software y aplicaciones'],
  },
  'Salud y bienestar': {
    'Salud': ['Salud comunitaria', 'Enfermería y partería'],
  },
};

export const PND: Record<string, string[]> = {
  'Eje Económico: Generación de empleo y crecimiento inclusivo': [
    'Fomentar la asociatividad y el emprendimiento productivo',
    'Impulsar la transformación digital de la economía',
  ],
  'Eje Social: Desarrollo humano y erradicación de la pobreza': [
    'Garantizar el acceso a servicios de educación y salud de calidad',
    'Erradicar la desnutrición crónica infantil',
  ],
  'Eje Institucional: Transparencia y fortalecimiento institucional': [
    'Fortalecer las capacidades institucionales del sector público',
    'Promover la participación ciudadana y el control social',
  ],
};

export const PLAN_ESTRATEGICO_INSTITUCIONAL: Record<string, string[]> = {
  'OE1. Fortalecer la formación integral del talento humano': [
    'Actualizar la oferta académica con enfoque en pertinencia territorial',
  ],
  'OE2. Consolidar la investigación científica y la innovación': [
    'Incrementar publicaciones y proyectos de I+D+i con impacto social',
  ],
  'OE3. Mejorar el posicionamiento nacional e internacional de la Universidad': [
    'Fortalecer la vinculación con la sociedad mediante proyectos de impacto territorial',
    'Consolidar alianzas estratégicas con GADs y entidades cooperantes',
  ],
};

export const LINEAS_INVESTIGACION: string[] = [
  'Tecnologías de la información y comunicación',
  'Seguridad y defensa',
  'Energía y sostenibilidad ambiental',
  'Agropecuaria y biotecnología',
  'Desarrollo territorial y economía social',
];

export const DOMINIOS: Record<string, string[]> = {
  'Seguridad, Defensa y Sociedad': ['Ciencias Aplicadas', 'Ciencias Sociales y Humanísticas'],
  'Vida, Ambiente y Producción Sostenible': ['Ciencias Agropecuarias', 'Ciencias Ambientales'],
  'Tecnología e Innovación': ['Ciencias de la Computación', 'Electrónica y Telecomunicaciones'],
};
