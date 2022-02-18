export const showToast = (
  trigger: (value: boolean) => void,
  timeout: number
) => {
  trigger(true);
  setTimeout(() => {
    trigger(false);
  }, timeout);
};
