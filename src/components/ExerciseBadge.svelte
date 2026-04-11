<script lang="ts">
  import { t } from '../lib/i18n';

  interface Props {
    number?: string;
  }

  let { number }: Props = $props();
</script>

<span
  class="inline-block rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wide bg-sage-100 text-sage-700"
>
  {t('exercise.badge')}{#if number}&nbsp;{number}{/if}
</span>
