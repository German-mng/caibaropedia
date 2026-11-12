import React from 'react';

export default function AnatomyExplorer() {
  const sections = [
    {
      id: 'periscope',
      number: '01',
      title: 'Перископическая краниальная морфология',
      tag: 'Скрытность и обзор',
      metric: '3 см',
      metricLabel: 'высота над уровнем воды',
      summary: 'Расположение глаз, наружных слуховых проходов и ноздрей строго по одной горизонтальной оси на наивысшей плоскости черепа.',
      description: 'Подобно бегемотам и крокодилам, капибара демонстрирует яркий пример конвергентной эволюции полуводных тетрапод. При полном погружении тела над поверхностью воды остается лишь верхняя кромка черепа. Зверь сохраняет 100% бинокулярный обзор, способность улавливать звуки в диапазоне до 35 кГц и дышать, оставаясь практически незаметным для хищников.'
    },
    {
      id: 'dentition',
      number: '02',
      title: 'Гипсодонтная зубная система',
      tag: 'Биомеханика питания',
      metric: 'до 2 мм',
      metricLabel: 'прирост резцов в неделю',
      summary: 'Долотообразные резцы без закрытых корней (элодонтия), непрерывно растущие на протяжении всей жизни особи.',
      description: 'Передняя грань резцов защищена твердой оранжевой эмалью, в то время как задняя поверхность сложена более податливым дентином. При регулярном перетирании жесткой прибрежной растительности дентин истирается быстрее, формируя острую самозатачивающуюся режущую кромку.'
    },
    {
      id: 'locomotion',
      number: '03',
      title: 'Опорно-двигательный аппарат и перепонки',
      tag: 'Гидродинамика и субстрат',
      metric: '35 км/ч',
      metricLabel: 'скорость рывка в воде',
      summary: 'Асимметричное строение конечностей: четырехпалые передние и трехпалые задние лапы с кожистыми перепонками.',
      description: 'Конечности представляют собой эволюционный компромисс между полукопытом и ластом. Между пальцами натянуты прочные соединительнотканные перепонки. На вязких топких отмелях лапа раскрывается веером, распределяя массу до 65 кг и предотвращая проваливание в ил.'
    },
    {
      id: 'integument',
      number: '04',
      title: 'Гидрофобный кожный покров',
      tag: 'Терморегуляция и защита',
      metric: '10–15 мин',
      metricLabel: 'полное высыхание шерсти',
      summary: 'Жесткие остевые волокна без подшерстка, способствующие быстрому отводу влаги при выходе на сушу.',
      description: 'Волосяной покров состоит исключительно из жестких щетинистых остевых волос, пропитанных секретом кожных желез. Вода не задерживается в волосяном покрове: животное обсыхает на тропическом солнце за четверть часа, что исключает мацерацию эпидермиса.'
    },
    {
      id: 'digestion',
      number: '05',
      title: 'Заднекишечная ферментация и цекотрофия',
      tag: 'Энергетический метаболизм',
      metric: '85%',
      metricLabel: 'усвоение микробного белка',
      summary: 'Гигантская слепая кишка объемом до 5 литров и практика повторной утренней ферментации цекотрофов.',
      description: 'Рацион из грубой околоводной травы с высоким содержанием лигнина требует специализированного аппарата ферментации. В слепой кишке триллионы симбиотических анаэробов расщепляют клетчатку на короткоцепочечные жирные кислоты.'
    },
    {
      id: 'morillo',
      number: '06',
      title: 'Обонятельная железа Морильо',
      tag: 'Социальная коммуникация',
      metric: '10–30',
      metricLabel: 'особей в семейной группе',
      summary: 'Овоидный кожный нарост на спинке носа у доминантных самцов для химической маркировки границ.',
      description: 'Морильо — высокоспециализированная сальная железа, выделяющая вязкий секрет с уникальным индивидуальным запахом. В период гона самец трется носовой частью о стебли тростника, поддерживая территориальную иерархию без летальных конфликтов.'
    }
  ];

  return (
    <section id="anatomy" className="py-16 sm:py-24 border-b border-[var(--border-hairline)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
          <div className="space-y-1">
            <span className="text-xs font-mono-code text-[var(--accent-green)]">
              Глава 1 · Морфологический атлас
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[var(--text-primary)]">
              Морфология и анатомия
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
            Анализ ключевых эволюционных адаптаций крупнейшего грызуна к полуводному биотопу Южной Америки.
          </p>
        </div>

        {/* Featured Visual Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-card)] relative aspect-[16/9]">
            <img
              src="/images/art-biology.jpg"
              alt="Анатомическое строение капибары"
              className="w-full h-full object-cover filter brightness-[0.98]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 inset-x-4 flex items-end justify-between text-white text-xs">
              <div className="space-y-0.5 max-w-md">
                <span className="font-mono-code text-[11px] text-[var(--accent-green)]">
                  Морфологический срез
                </span>
                <p className="font-editorial-serif italic text-white/90 text-sm">
                  Выравнивание органов чувств по линии воды — конвергентная адаптация полуводных тетрапод.
                </p>
              </div>
              <span className="hidden sm:inline font-mono-code text-[11px] text-[var(--text-muted)]">
                Hydrochoerus hydrochaeris
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-mono-code text-[var(--accent-green)]">
                Таксономический паспорт
              </span>
              <h3 className="text-lg font-medium text-[var(--text-primary)]">
                Биометрические константы
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Семейство свинковых (Caviidae). Единственный сохранившийся крупный представитель подсемейства гидрохоэрин.
              </p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-[var(--border-hairline)] text-xs font-mono-code">
              <div className="flex justify-between py-1 border-b border-[var(--border-hairline)]">
                <span className="text-[var(--text-muted)]">Зубная формула</span>
                <span className="font-medium text-[var(--text-primary)]">1.0.1.3 / 1.0.1.3 (20)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-hairline)]">
                <span className="text-[var(--text-muted)]">Половой диморфизм</span>
                <span className="font-medium text-[var(--text-primary)]">Самки крупнее (+10%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-hairline)]">
                <span className="text-[var(--text-muted)]">Объем легких</span>
                <span className="font-medium text-[var(--text-primary)]">Адаптирован к апноэ</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-muted)]">Температура тела</span>
                <span className="font-medium text-[var(--accent-green)]">36.5°C – 37.5°C</span>
              </div>
            </div>
          </div>

        </div>

        {/* 6 Structured Academic Anatomy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((sec) => (
            <div
              key={sec.id}
              className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] hover:border-[var(--border-hover)] transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="text-[var(--accent-green)] font-medium">{sec.number}</span>
                  <span className="text-[var(--text-muted)]">
                    {sec.tag}
                  </span>
                </div>

                <h4 className="text-base font-medium text-[var(--text-primary)] leading-snug">
                  {sec.title}
                </h4>

                <p className="text-xs font-editorial-serif italic text-[var(--text-secondary)] leading-relaxed">
                  «{sec.summary}»
                </p>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {sec.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-hairline)]">
                <div className="text-lg font-mono-code font-medium text-[var(--text-primary)]">
                  {sec.metric}
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {sec.metricLabel}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
