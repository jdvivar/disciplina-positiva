<script lang="ts">
  interface Props {
    /** 0 = seed, 1 = full tree */
    progress: number;
  }

  let { progress }: Props = $props();

  // Derive growth parameters from progress
  let stemHeight = $derived(Math.round(8 + progress * 52));
  let hasBranches = $derived(progress > 0.55);
  let hasCanopy = $derived(progress > 0.85);
  let hasFruits = $derived(progress > 0.92);
  let hasRoots = $derived(progress > 0.8);
  let hasBud = $derived(progress > 0.03);
  let trunkWidth = $derived(1.2 + progress * 1.8);
  let leafCount = $derived(Math.floor(progress * 12));

  // SVG dimensions and center
  let svgWidth = $derived(hasCanopy ? 96 : hasBranches ? 72 : 56);
  let svgHeight = $derived(hasCanopy ? 96 : 80);
  let cx = $derived(hasCanopy ? 48 : hasBranches ? 36 : 28);
  let baseY = $derived(hasCanopy ? 88 : 78);
  let stemY = $derived(baseY - stemHeight);

  // Branch positions
  let branchY1 = $derived(baseY - stemHeight * 0.55);
  let branchY2 = $derived(baseY - stemHeight * 0.75);

  // Canopy / bud Y
  let canopyY = $derived(baseY - stemHeight + 10);
  let budY = $derived(baseY - stemHeight);

  // Generate leaf positions along the stem
  interface Leaf {
    y: number;
    dx: number;
    size: number;
    color: string;
  }

  let leaves = $derived.by((): Leaf[] => {
    if (leafCount === 0) return [];
    const result: Leaf[] = [];
    const colors = ['#b7e4c7', '#d8f3dc', '#95d5b2'];
    const startY = baseY - stemHeight * 0.3;
    const endY = stemY + 8;
    const spacing = leafCount > 1 ? (startY - endY) / (leafCount - 1) : 0;

    for (let i = 0; i < leafCount; i++) {
      const y = leafCount === 1 ? (startY + endY) / 2 : startY - i * spacing;
      const dx = i % 2 === 0 ? -1 : 1;
      const sizeFactor = 1 - (i / Math.max(leafCount, 1)) * 0.4;
      const size = (0.6 + progress * 0.4) * sizeFactor * 14;
      result.push({ y, dx, color: colors[i % 3], size });
    }
    return result;
  });
</script>

<div style="display: flex; justify-content: center; padding: 24px 0;">
  <svg
    width={svgWidth}
    height={svgHeight}
    viewBox="0 0 {svgWidth} {svgHeight}"
    role="img"
    aria-hidden="true"
  >
    <!-- Roots -->
    {#if hasRoots}
      <path d="M{cx} {baseY} C{cx - 6} {baseY + 4}, {cx - 14} {baseY + 6}, {cx - 18} {baseY + 4}" stroke="#95d5b2" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M{cx} {baseY} C{cx + 6} {baseY + 4}, {cx + 14} {baseY + 6}, {cx + 18} {baseY + 4}" stroke="#95d5b2" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    {/if}

    <!-- Soil -->
    <ellipse cx={cx} cy={baseY} rx={8 + progress * 10} ry="3" fill="#d8f3dc"/>

    <!-- Trunk/Stem -->
    <path
      d="M{cx} {baseY} L{cx} {stemY}"
      stroke={hasBranches ? '#52796f' : '#95d5b2'}
      stroke-width={trunkWidth}
      fill="none"
      stroke-linecap="round"
    />

    <!-- Branches -->
    {#if hasBranches}
      <path d="M{cx} {branchY1} Q{cx - 10} {branchY1 - 6}, {cx - 20} {branchY1 - 4}" stroke="#52796f" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M{cx} {branchY1} Q{cx + 10} {branchY1 - 6}, {cx + 20} {branchY1 - 4}" stroke="#52796f" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M{cx} {branchY2} Q{cx - 8} {branchY2 - 6}, {cx - 16} {branchY2 - 4}" stroke="#52796f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M{cx} {branchY2} Q{cx + 8} {branchY2 - 6}, {cx + 16} {branchY2 - 4}" stroke="#52796f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    {/if}

    <!-- Canopy -->
    {#if hasCanopy}
      <ellipse cx={cx} cy={canopyY} rx={28} ry={22} fill="#b7e4c7" opacity="0.4"/>
      <ellipse cx={cx - 10} cy={canopyY - 2} rx={16} ry={14} fill="#b7e4c7" opacity="0.5"/>
      <ellipse cx={cx + 10} cy={canopyY - 2} rx={16} ry={14} fill="#d8f3dc" opacity="0.5"/>
      <ellipse cx={cx} cy={canopyY - 8} rx={14} ry={12} fill="#95d5b2" opacity="0.4"/>
    {/if}

    <!-- Leaves -->
    {#each leaves as leaf}
      <path
        d="M{cx} {leaf.y} C{cx + leaf.dx * leaf.size * 0.6} {leaf.y - leaf.size * 0.5}, {cx + leaf.dx * leaf.size} {leaf.y - leaf.size * 0.6}, {cx + leaf.dx * leaf.size * 1.1} {leaf.y - leaf.size * 0.3} C{cx + leaf.dx * leaf.size * 1.2} {leaf.y - leaf.size * 0.1}, {cx + leaf.dx * leaf.size * 0.6} {leaf.y + leaf.size * 0.2}, {cx} {leaf.y}Z"
        fill={leaf.color}
      />
    {/each}

    <!-- Top bud -->
    {#if hasBud && !hasCanopy}
      <path d="M{cx} {budY} C{cx - 4} {budY - 6}, {cx - 2} {budY - 8}, {cx} {budY - 8} C{cx + 2} {budY - 8}, {cx + 4} {budY - 6}, {cx} {budY}Z" fill="#95d5b2"/>
    {/if}

    <!-- Fruits -->
    {#if hasFruits}
      <circle cx={cx - 14} cy={canopyY - 6} r="2.5" fill="#40916c" opacity="0.6"/>
      <circle cx={cx + 8} cy={canopyY - 12} r="2.5" fill="#40916c" opacity="0.6"/>
      <circle cx={cx} cy={canopyY - 16} r="2" fill="#40916c" opacity="0.6"/>
      <circle cx={cx + 14} cy={canopyY} r="2" fill="#40916c" opacity="0.5"/>
      <circle cx={cx - 10} cy={canopyY + 4} r="2" fill="#40916c" opacity="0.5"/>
    {/if}
  </svg>
</div>
