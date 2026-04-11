<script lang="ts">
  import { t } from '../lib/i18n';

  interface Props {
    completed?: boolean;
    number?: string;
  }

  let { completed = false, number }: Props = $props();
</script>

<span
  class="inline-block rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wide
    {completed ? 'bg-sage-100 text-sage-600' : 'bg-sage-100 text-sage-700'}"
>
  {completed ? t('exercise.completed') : t('exercise.badge')}{#if number}&nbsp;{number}{/if}
</span>
