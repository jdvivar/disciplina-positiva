<script lang="ts">
  import { t } from '../lib/i18n';

  interface Props {
    completed?: boolean;
  }

  let { completed = false }: Props = $props();
</script>

<span
  class="inline-block rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide
    {completed ? 'bg-sage-100 text-sage-600' : 'bg-sage-100 text-sage-700'}"
>
  {completed ? t('exercise.completed') : t('exercise.badge')}
</span>
