export function handleTextAreaChange(
  e: React.ChangeEvent<HTMLTextAreaElement>,
) {
  setFormValues({ ...formValues, [e.target.name]: e.target.value });
}
