import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { getApiProblem } from './client'

/**
 * Maps a failed request's RFC 7807 `errors` member onto the corresponding
 * form fields via React Hook Form's setError. Returns the `detail` string
 * when there's no field-level error to show as a general alert instead.
 */
export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): string | null {
  const problem = getApiProblem(error)
  if (!problem) return 'Não foi possível completar a operação. Tente novamente.'

  if (problem.errors) {
    for (const [field, messages] of Object.entries(problem.errors)) {
      setError(field as Path<T>, { type: 'server', message: messages[0] })
    }
    // Only surface detail as a general alert if none of the errors landed on a known field.
    return null
  }

  return problem.detail ?? 'Não foi possível completar a operação. Tente novamente.'
}
