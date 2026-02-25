import { v4 as uuid } from "uuid";
import type { KeyboardEvent } from "happy-dom";

interface ITask {
  id: string;
  label: string;
  checked: boolean;
}

export function useTasks(cb?: (value: ITask[]) => void) {
  const tasks = ref<ITask[]>([{ id: uuid(), label: "", checked: false }]);
  if (cb) watch(tasks, cb, { deep: true });

  const add = async () => {
    const task = {
      id: uuid(),
      checked: false,
      label: "",
    };
    tasks.value = [...tasks.value, task];

    await nextTick();
    const taskInput = document.getElementById(`task-input-${task.id}`);
    if (!taskInput) return;

    taskInput.focus();
    taskInput.scrollIntoView({ behavior: "smooth" });
  };
  const remove = async (id: string) => {
    const index = tasks.value.findIndex(t => t.id === id);
    if (index === -1) return;
    if (tasks.value.length <= 1) return;

    const previousIndex = Math.max(0, index - 1);
    tasks.value.splice(index, 1);
    await nextTick();

    const previousTaskInput = document.getElementById(`task-input-${tasks.value[previousIndex]?.id}`);
    previousTaskInput?.focus();
    previousTaskInput?.scrollIntoView({ behavior: "smooth" });
  };
  const keyDown = (id: string, event: KeyboardEvent) => {
    switch (event.key) {
      case "Enter": {
        add().then();
        break;
      }
      case "Backspace": {
        const index = tasks.value.findIndex(t => t.id === id);
        if (index === -1) return;

        const taskValue = tasks.value[index]?.label ?? "";
        if (taskValue.length > 0) return;
        remove(id).then();
        break;
      }
      default: {
        return;
      }
    }

    event.preventDefault();
    event.stopPropagation();
  };

  return {
    tasks,

    add,
    remove,
    keyDown,
  };
}
