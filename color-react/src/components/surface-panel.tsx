import { useState } from 'react';
import type { PaletteEntry } from '@core/palette';
import type { AccentPalette } from '@/hooks/use-palette';
import type { FgContrastMode } from '@/store/theme-store';
import type { ShapeUrlState } from '@core/url-state/shape';
import { contrastRatio, invertHex } from '@core/color-math';
import { generateShadows, type ShadowConfig } from '@core/shadows';
import { LiquidGlass } from '@core/liquid-glass';
import { BrutalistEcho, deriveBorderFromBg } from '@core/brutalist-echo';
import { PanelSvg } from '@/components/panel-svg';
import { Sun, Moon, SunDim, MoonStar } from 'lucide-react';

const microText = { fontSize: '0.6923rem', lineHeight: 1.4 } as const;

export interface SurfacePanelProps {
  panelType: 'light' | 'dark' | 'light-hc' | 'dark-hc';
  palette: Record<number, PaletteEntry>;
  neutral: Record<number, PaletteEntry>;
  brand: Record<number, PaletteEntry>;
  error: Record<number, PaletteEntry>;
  errorSurface: Record<number, PaletteEntry>;
  brandSwatchOverride: { hex: string; L: number } | null;
  brandInvert: boolean;
  errorSwatchOverride: { hex: string; L: number } | null;
  errorInvert: boolean;
  accentPalettes: AccentPalette[];
  fgContrastMode: FgContrastMode;
  shapeTokens?: { borderEnabled: boolean; borderWidth: number; borderRadius: number };
  shape?: Partial<ShapeUrlState> | null;
}

/** Pick foreground from a palette's near-white and near-black steps by comparing actual contrasts.
 *  More accurate than hypothetical pure-white/dark — palette-tinted extremes can beat either. */
function choosePaletteFg(
  bgHex: string,
  lightHex: string,
  darkHex: string,
  mode: FgContrastMode,
): string {
  const crLight = contrastRatio(bgHex, lightHex);
  const crDark = contrastRatio(bgHex, darkHex);

  switch (mode) {
    case 'best':
      return crLight >= crDark ? lightHex : darkHex;
    case 'preferLight':
      if (crLight >= 4.5) return lightHex;
      if (crDark >= 4.5) return darkHex;
      return lightHex;
    case 'preferDark':
      if (crDark >= 4.5) return darkHex;
      if (crLight >= 4.5) return lightHex;
      return darkHex;
  }
}

interface PanelConfig {
  label: string;
  bgHex: string;
  textHex: string;
  isDark: boolean;
  cardHex: string;
  elevatedHex: string;
  inputHoverHex: string;
  mutedHex: string;
  mutedFgHex: string;
  borderHex: string;
  borderMutedHex: string;
}

function getHex(map: Record<number, PaletteEntry>, step: number): string {
  return map[step]?.hex ?? '#888888';
}

interface PreviewFieldProps {
  id: string;
  label: string;
  placeholder: string;
  bgHex: string;
  textHex: string;
  borderHex: string;
  hoverBorderHex: string;
  focusBorderHex: string;
  ringHex: string;
  borderWidth: number;
  radius: number;
}

function PreviewField({
  id, label, placeholder, bgHex, textHex, borderHex, hoverBorderHex, focusBorderHex, ringHex, borderWidth, radius,
}: PreviewFieldProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const stateName = focused ? 'focus' : hovered ? 'hover' : 'rest';
  const activeBorder = focused ? focusBorderHex : hovered ? hoverBorderHex : borderHex;

  return (
    <input
      id={id}
      type="text"
      aria-label={label}
      placeholder={placeholder}
      className="w-full px-2.5 py-1.5 text-caption transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      data-state={stateName}
      style={{
        backgroundColor: bgHex,
        color: textHex,
        border: `${borderWidth}px solid ${activeBorder}`,
        borderRadius: radius,
        outline: focused ? `2px solid ${ringHex}` : 'none',
        outlineOffset: focused ? 1 : 0,
      }}
    />
  );
}

function getPanelConfig(
  panelType: SurfacePanelProps['panelType'],
  palette: Record<number, PaletteEntry>,
  neutral: Record<number, PaletteEntry>,
): PanelConfig {
  switch (panelType) {
    case 'light':
      return {
        label: 'Light',
        bgHex: getHex(palette, 75),
        textHex: getHex(palette, 850),
        isDark: false,
        cardHex: getHex(palette, 25),
        elevatedHex: getHex(palette, 0),
        inputHoverHex: getHex(palette, 400),
        mutedHex: getHex(palette, 200),
        mutedFgHex: getHex(palette, 700),
        borderHex: getHex(palette, 300),
        borderMutedHex: getHex(palette, 100),
      };
    case 'dark':
      return {
        label: 'Dark',
        bgHex: getHex(palette, 875),
        textHex: getHex(palette, 75),
        isDark: true,
        cardHex: getHex(palette, 850),
        elevatedHex: getHex(palette, 825),
        inputHoverHex: getHex(palette, 500),
        mutedHex: getHex(palette, 700),
        mutedFgHex: getHex(palette, 300),
        borderHex: getHex(palette, 600),
        borderMutedHex: getHex(palette, 700),
      };
    case 'light-hc':
      return {
        label: 'Light High Contrast',
        bgHex: getHex(neutral, 75),
        textHex: '#000000',
        isDark: false,
        cardHex: '#FFFFFF',
        elevatedHex: '#FFFFFF',
        inputHoverHex: getHex(neutral, 500),
        mutedHex: getHex(neutral, 200),
        mutedFgHex: getHex(neutral, 700),
        borderHex: getHex(neutral, 400),
        borderMutedHex: getHex(neutral, 300),
      };
    case 'dark-hc':
      return {
        label: 'Dark High Contrast',
        bgHex: '#000000',
        textHex: '#FFFFFF',
        isDark: true,
        cardHex: getHex(neutral, 950),
        elevatedHex: getHex(neutral, 950),
        inputHoverHex: getHex(neutral, 400),
        mutedHex: getHex(neutral, 700),
        mutedFgHex: getHex(neutral, 300),
        borderHex: getHex(neutral, 500),
        borderMutedHex: getHex(neutral, 600),
      };
  }
}

interface SurfaceCard { name: string; bg: string; token: string }

function getSurfaceCards(
  panelType: SurfacePanelProps['panelType'],
  c: PanelConfig,
  brand: Record<number, PaletteEntry>,
): SurfaceCard[] {
  switch (panelType) {
    case 'light':
      return [
        { name: 'Elevated', bg: c.elevatedHex, token: 'surface-0' },
        { name: 'Card', bg: c.cardHex, token: 'surface-25' },
        { name: 'Accent', bg: getHex(brand, 100), token: 'brand-100' },
        { name: 'Muted', bg: c.mutedHex, token: 'surface-200' },
      ];
    case 'dark':
      return [
        { name: 'Elevated', bg: c.elevatedHex, token: 'surface-825' },
        { name: 'Card', bg: c.cardHex, token: 'surface-850' },
        { name: 'Accent', bg: getHex(brand, 800), token: 'brand-800' },
        { name: 'Muted', bg: c.mutedHex, token: 'surface-700' },
      ];
    case 'light-hc':
      return [
        { name: 'Elevated', bg: c.elevatedHex, token: '#fff — collapsed' },
        { name: 'Card', bg: c.cardHex, token: '#fff' },
        { name: 'Accent', bg: getHex(brand, 100), token: 'brand-100' },
        { name: 'Muted', bg: c.mutedHex, token: 'neutral-200' },
      ];
    case 'dark-hc':
      return [
        { name: 'Elevated', bg: c.elevatedHex, token: 'neutral-950 — collapsed' },
        { name: 'Card', bg: c.cardHex, token: 'neutral-950' },
        { name: 'Accent', bg: getHex(brand, 800), token: 'brand-800' },
        { name: 'Muted', bg: c.mutedHex, token: 'neutral-700' },
      ];
  }
}

export function SurfacePanel({
  panelType,
  palette,
  neutral,
  brand,
  error,
  errorSurface,
  brandSwatchOverride,
  brandInvert,
  errorSwatchOverride,
  errorInvert,
  accentPalettes,
  fgContrastMode,
  shapeTokens,
  shape,
}: SurfacePanelProps) {
  const config = getPanelConfig(panelType, palette, neutral);
  const { label, bgHex, textHex, isDark, cardHex, elevatedHex, inputHoverHex, mutedFgHex, borderHex, borderMutedHex } = config;

  const bw = shapeTokens?.borderEnabled !== false ? (shapeTokens?.borderWidth ?? 1) : 0;
  const br = shapeTokens?.borderRadius ?? 8;

  // Neomorph / Glass / Neobrutalism only for Standard panels — HC panels stay paper-like by constraint.
  const isStandardPanel = panelType === 'light' || panelType === 'dark';
  const isNeomorph = isStandardPanel && shape?.shapeStyle === 'neomorph';
  const isGlass = isStandardPanel && shape?.shapeStyle === 'glass';
  const isNeobrutalism = isStandardPanel && shape?.shapeStyle === 'neobrutalism';
  const glassDepth = shape?.glassDepth ?? 0.2;
  const glassBlur = shape?.glassBlur ?? 1.0;
  const glassDispersion = shape?.glassDispersion ?? 0.5;

  const brutalistOffsetX = shape?.shadowOffsetX ?? 2;
  const brutalistOffsetY = shape?.shadowOffsetY ?? 4;
  const brutalistScale = shape?.shadowScale ?? 1.272;
  const brutalistStrength = shape?.shadowStrength ?? 1;
  const brutalistStrokeWidth = bw || 1;
  const brutalistVariant = shape?.brutalistVariant ?? 'outlined';

  const brutalistEnabled = isNeobrutalism && (shape?.shadowEnabled ?? true);
  /** Per-element border derived from that element's bg — matches shape-react's logic. */
  function brutalBorder(bg: string): string {
    return shape?.shadowColorMode === 'custom' && shape?.shadowCustomColor
      ? shape.shadowCustomColor
      : deriveBorderFromBg(bg);
  }
  function brutalEcho(level: 'xs' | 'sm' | 'md' | 'lg' | 'xl', radius: number, bg: string) {
    if (!brutalistEnabled) return null;
    const border = brutalBorder(bg);
    const isSolid = brutalistVariant === 'solid';
    return (
      <BrutalistEcho
        level={level}
        offsetX={brutalistOffsetX}
        offsetY={brutalistOffsetY}
        scale={brutalistScale}
        strokeWidth={isSolid ? 0 : brutalistStrokeWidth}
        borderRadius={radius}
        bgColor={isSolid ? border : bg}
        borderColor={border}
        opacity={brutalistStrength}
      />
    );
  }

  const neomorphShadows = isNeomorph ? generateShadows(bgHex, isDark, {
    type: 'neumorphic',
    strength: shape?.shadowStrength ?? 1,
    blurScale: shape?.shadowBlurScale ?? 1,
    scale: shape?.shadowScale ?? 1.272,
    colorMode: 'auto',
    customColor: '#000000',
  } as ShadowConfig) : [];
  const shadowSm = neomorphShadows.find(s => s.name === 'sm')?.shadow;
  const shadowMd = neomorphShadows.find(s => s.name === 'md')?.shadow;

  const surfaceCards = getSurfaceCards(panelType, config, brand);

  // Button colors
  const pinnedHex = brandSwatchOverride?.hex;
  const primaryBg = pinnedHex
    ? (isDark && brandInvert ? invertHex(pinnedHex) : pinnedHex)
    : (isDark ? getHex(brand, 400) : getHex(brand, 600));
  const secondaryBg = isDark ? getHex(brand, 800) : getHex(brand, 200);
  const pinnedErrorHex = errorSwatchOverride?.hex;
  const destructiveBg = pinnedErrorHex
    ? (isDark && errorInvert ? invertHex(pinnedErrorHex) : pinnedErrorHex)
    : (isDark ? getHex(error, 400) : getHex(error, 600));

  // Use palette extremes (25/975) as fg candidates — tinted near-white/near-black
  // for richer contrast than pure #FFF/#1A1A1A, and per-palette consistency.
  const primaryFg = choosePaletteFg(primaryBg, getHex(brand, 25), getHex(brand, 975), fgContrastMode);
  const secondaryFg = choosePaletteFg(secondaryBg, getHex(brand, 25), getHex(brand, 975), fgContrastMode);
  const destructiveFg = choosePaletteFg(destructiveBg, getHex(error, 25), getHex(error, 975), fgContrastMode);

  // Accent items for mini badges
  const accentItems = accentPalettes.map((accent) => {
    const accentLookup: Record<number, PaletteEntry> = {};
    for (const e of accent.slatedPalette) {
      accentLookup[e.step as number] = e;
    }
    const accentActionLookup: Record<number, PaletteEntry> = {};
    for (const e of accent.palette) {
      accentActionLookup[e.step as number] = e;
    }
    const dotBg = accent.pin
      ? (isDark && accent.invert ? invertHex(accent.hex) : accent.hex)
      : (isDark ? getHex(accentActionLookup, 400) : getHex(accentActionLookup, 600));
    const badgeBg = isDark ? getHex(accentLookup, 800) : getHex(accentLookup, 100);
    const badgeBorder = isDark ? getHex(accentLookup, 700) : getHex(accentLookup, 300);
    const badgeText = isDark ? getHex(accentActionLookup, 50) : getHex(accentActionLookup, 950);
    return { name: accent.name, dotBg, badgeBg, badgeBorder, badgeText };
  });

  const errDotBg = isDark ? getHex(error, 400) : getHex(error, 600);
  const errNoticeBg = isDark ? getHex(errorSurface, 800) : getHex(errorSurface, 100);
  const errNoticeText = isDark ? getHex(error, 50) : getHex(error, 950);
  const errNoticeBorder = isDark ? getHex(errorSurface, 700) : getHex(errorSurface, 300);

  const innerRadius = Math.max(4, br - 2);
  const cardBorderHex = brutalistEnabled ? brutalBorder(cardHex) : borderMutedHex;

  return (
    <div
      className="p-5 flex flex-col gap-4"
      style={{ backgroundColor: bgHex, color: textHex, border: bw ? `${bw}px solid ${borderMutedHex}` : 'none', borderRadius: br + 4 }}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-body-s font-semibold min-w-0" style={{ color: textHex }}>
          {panelType === 'light' ? 'Surfaces' :
           panelType === 'dark' ? 'Surfaces' :
           'Neutral Surfaces'}
        </h3>
        <span
          className="text-caption font-semibold px-1.5 py-0.5 inline-flex items-center gap-1 shrink-0"
          style={{
            backgroundColor: cardHex,
            border: bw ? `${bw}px solid ${borderMutedHex}` : 'none',
            borderRadius: Math.max(4, br - 2),
            color: textHex,
          }}
        >
          {panelType === 'light' && <Sun size={11} />}
          {panelType === 'dark' && <Moon size={11} />}
          {panelType === 'light-hc' && <SunDim size={11} />}
          {panelType === 'dark-hc' && <MoonStar size={11} />}
          {label}
        </span>
      </div>

      {/* Surface cards — full width */}
      <div className="grid grid-cols-4 gap-2">
        {surfaceCards.map((card) => {
          if (isGlass) {
            return (
              <div
                key={card.name}
                className="relative min-h-20 overflow-hidden"
                style={{
                  backgroundColor: card.bg,
                  border: bw ? `${bw}px solid ${borderMutedHex}` : 'none',
                  borderRadius: br,
                }}
              >
                <LiquidGlass depth={glassDepth} blur={glassBlur} dispersion={glassDispersion} cornerRadius={br} onDark={isDark}>
                  <div className="p-2.5 text-caption flex flex-col justify-between min-h-20" style={{ color: textHex }}>
                    <span className="font-medium">{card.name}</span>
                    <span className="font-mono" style={{ ...microText, color: mutedFgHex }}>{card.token}</span>
                  </div>
                </LiquidGlass>
              </div>
            );
          }
          const cardBorder = brutalistEnabled ? brutalBorder(card.bg) : borderMutedHex;
          const showCardBorder = brutalistEnabled ? true : !!bw;
          return (
            <div
              key={card.name}
              className="p-2.5 text-caption flex flex-col justify-between min-h-20"
              style={{
                backgroundColor: card.bg,
                color: textHex,
                border: showCardBorder ? `${bw || 1}px solid ${cardBorder}` : 'none',
                borderRadius: br,
                boxShadow: brutalistEnabled ? undefined : shadowMd,
              }}
            >
              <span className="font-medium">{card.name}</span>
              <span className="font-mono" style={{ ...microText, color: mutedFgHex }}>{card.token}</span>
            </div>
          );
        })}
      </div>

      <div className="relative">
        {brutalEcho('md', br, cardHex)}
        <div
          className="relative p-4 flex flex-col gap-3.5"
          style={{
            backgroundColor: cardHex,
            border: bw || brutalistEnabled ? `${bw || 1}px solid ${cardBorderHex}` : 'none',
            borderRadius: br,
            boxShadow: brutalistEnabled || isGlass ? undefined : shadowMd,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex flex-col gap-2">
              <div>
                <h4 className="text-body-s font-semibold" style={{ color: textHex }}>
                  Team access
                </h4>
                <p className="text-caption mt-0.5" style={{ color: mutedFgHex }}>
                  Invite a teammate and choose what they can see.
                </p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 font-semibold"
                  style={{
                    ...microText,
                    backgroundColor: errNoticeBg,
                    color: errNoticeText,
                    border: bw ? `${bw}px solid ${errNoticeBorder}` : 'none',
                    borderRadius: innerRadius,
                  }}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: errDotBg }} />
                  Error
                </div>
                {accentItems.map((item) => (
                  <div
                    key={item.name}
                    className="inline-flex items-center gap-1 px-2 py-0.5 font-semibold"
                    style={{
                      ...microText,
                      backgroundColor: item.badgeBg,
                      color: item.badgeText,
                      border: bw ? `${bw}px solid ${item.badgeBorder}` : 'none',
                      borderRadius: innerRadius,
                    }}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.dotBg }} />
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[90px] shrink-0">
              <PanelSvg
                key={`${panelType}-${getHex(brand, 300)}-${getHex(brand, 500)}-${getHex(palette, 75)}-${accentPalettes.map(a => a.hex).join(',')}`}
                idx={['light', 'dark', 'light-hc', 'dark-hc'].indexOf(panelType)}
                panelType={panelType}
                brand={brand}
                className="w-full h-[90px] block"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${panelType}-email`} className="text-caption font-medium" style={{ color: textHex }}>
              Email address
            </label>
            <PreviewField
              id={`${panelType}-email`}
              label="Email address"
              placeholder="name@company.com"
              bgHex={elevatedHex}
              textHex={textHex}
              borderHex={borderHex}
              hoverBorderHex={inputHoverHex}
              focusBorderHex={primaryBg}
              ringHex={primaryBg}
              borderWidth={bw || 1}
              radius={innerRadius}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold shrink-0" style={{ ...microText, color: mutedFgHex }}>Border</span>
            <div className="h-px flex-1" style={{ backgroundColor: borderHex }} />
            <span className="font-semibold shrink-0 ml-2" style={{ ...microText, color: mutedFgHex }}>Border Muted</span>
            <div className="h-px flex-1" style={{ backgroundColor: borderMutedHex }} />
          </div>

          <div className="flex gap-2">
            {([
              { label: 'Delete', bg: destructiveBg, fg: destructiveFg },
              { label: 'Cancel', bg: secondaryBg, fg: secondaryFg },
              { label: 'Send invite', bg: primaryBg, fg: primaryFg },
            ] as const).map((btn) => {
              const btnR = innerRadius;
              const showBtnBorder = brutalistEnabled && brutalistVariant !== 'solid';
              const pressCls =
                brutalistEnabled ? 'neobrutalism-press' :
                isGlass ? 'glass-press' :
                isNeomorph ? 'neomorph-press' :
                'paper-press';
              const pressVars = brutalistEnabled
                ? {
                    ['--press-x' as string]: `${brutalistOffsetX / brutalistScale}px`,
                    ['--press-y' as string]: `${brutalistOffsetY / brutalistScale}px`,
                  }
                : {};
              return (
                <div key={btn.label} className="relative inline-flex">
                  {brutalEcho('sm', btnR, btn.bg)}
                  <button
                    className={`relative px-3 py-1.5 text-caption font-medium ${pressCls}`}
                    style={{
                      backgroundColor: btn.bg,
                      color: btn.fg,
                      borderRadius: btnR,
                      border: showBtnBorder ? `${brutalistStrokeWidth}px solid ${brutalBorder(btn.bg)}` : 'none',
                      boxShadow: brutalistEnabled ? undefined : shadowSm,
                      cursor: 'pointer',
                      ...pressVars,
                    }}
                  >
                    {btn.label}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
