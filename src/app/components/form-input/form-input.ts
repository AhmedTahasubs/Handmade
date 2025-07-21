import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ],
  imports:[CommonModule]
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type: string = 'text';
  @Input() icon?: string;
  @Input() required = false;
  @Input() error?: string;
  @Input() disabled = false;
  @Input() autocomplete?: string;
  @Input() helperText?: string;

  value: string = '';
  touched = false;
  dirty = false;
  showPassword = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value = inputValue;
    this.dirty = true;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
  }

  onFocus(): void {
    this.touched = true;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getInputType(): string {
    return this.type === 'password' && this.showPassword ? 'text' : this.type;
  }

  getInputClasses(): string {
    const base = 'block w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none text-sm';
    const border = this.error
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400';
    const bg = 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white';
    return `${base} ${border} ${bg}`;
  }

  get inputId(): string {
    return this.label?.toLowerCase().replace(/\s+/g, '-') ?? '';
  }
}
