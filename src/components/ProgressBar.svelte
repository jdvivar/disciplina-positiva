<script lang="ts">
  interface Props {
    completed: number;
    total: number;
    label?: string;
  }
  let { completed, total, label }: Props = $props();
  let percentage = $derived(total > 0 ? (completed / total) * 100 : 0);
</script>

{#if label}
  <div class="font-body text-s text-sage-500 mb-1">{label}</div>
{/if}
<div class="h-1.5 rounded-full bg-sage-100 overflow-hidden">
  <div
    class="h-full rounded-full bg-sage-600 transition-all duration-300"
    style="width: {percentage}%"
  ></div>
</div>
