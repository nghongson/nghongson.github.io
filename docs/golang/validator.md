You're looking for a common and powerful pattern to validate input, often called a **Chain of Responsibility** or a **Validation Pipeline**. This pattern allows you to chain multiple validation rules together, where each validator performs a specific check, and if it passes, it hands off the input to the next validator in the chain. If any validator fails, the chain breaks, and an error is returned.

This is excellent for:

- **Decoupling:** Each validator is independent.
- **Flexibility:** Easily add, remove, or reorder validators.
- **Readability:** Each validator has a clear single responsibility.

Let's break down the Go pattern for this.

---

### The Chain of Responsibility Pattern for Validation

**Core Components:**

1.  **Validator Interface:** Defines the contract for any validator in the chain. It typically takes the input and returns an error (nil if valid, otherwise an error indicating what failed).
2.  **Validation Input:** The data structure you want to validate.
3.  **Chain Executor:** A mechanism to run all validators in sequence.

---

### Example: Validating a User Registration Request

Let's say we have a `UserRegistrationRequest` and we want to validate:

- Email format
- Password strength (minimum length, special chars)
- Username presence
- Agree to Terms of Service

```go
package main

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
)

// --- 1. Define the Input Data Structure ---

type UserRegistrationRequest struct {
	Username        string
	Email           string
	Password        string
	ConfirmPassword string // For password matching validator
	AgreeToTOS      bool
}

// --- 2. Define the Validator Interface ---

// Validator defines the contract for a single validation rule.
// It takes the input request and returns an error if validation fails,
// or nil if it passes.
type Validator interface {
	Validate(req *UserRegistrationRequest) error
}

// --- 3. Implement Specific Validators ---

// EmailValidator checks for a valid email format.
type EmailValidator struct{}

func (v *EmailValidator) Validate(req *UserRegistrationRequest) error {
	if req.Email == "" {
		return errors.New("email cannot be empty")
	}
	// A simple regex for demonstration, consider using a more robust library for production
	if !regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`).MatchString(req.Email) {
		return errors.New("invalid email format")
	}
	return nil
}

// UsernameValidator checks for username presence and minimum length.
type UsernameValidator struct{}

func (v *UsernameValidator) Validate(req *UserRegistrationRequest) error {
	if req.Username == "" {
		return errors.New("username cannot be empty")
	}
	if len(req.Username) < 3 {
		return errors.New("username must be at least 3 characters long")
	}
	return nil
}

// PasswordStrengthValidator checks for minimum length and presence of a special character.
type PasswordStrengthValidator struct{}

func (v *PasswordStrengthValidator) Validate(req *UserRegistrationRequest) error {
	if req.Password == "" {
		return errors.New("password cannot be empty")
	}
	if len(req.Password) < 8 {
		return errors.New("password must be at least 8 characters long")
	}
	if !regexp.MustCompile(`[!@#$%^&*()]`).MatchString(req.Password) {
		return errors.New("password must contain at least one special character (!@#$%^&*())")
	}
	return nil
}

// PasswordMatchValidator checks if password and confirm password match.
type PasswordMatchValidator struct{}

func (v *PasswordMatchValidator) Validate(req *UserRegistrationRequest) error {
	if req.Password != req.ConfirmPassword {
		return errors.New("password and confirm password do not match")
	}
	return nil
}

// TOSAgreementValidator checks if the user agreed to the Terms of Service.
type TOSAgreementValidator struct{}

func (v *TOSAgreementValidator) Validate(req *UserRegistrationRequest) error {
	if !req.AgreeToTOS {
		return errors.New("you must agree to the Terms of Service")
	}
	return nil
}

// --- 4. Create the Validation Chain (Processor) ---

// ValidationChain holds a slice of Validator interfaces.
type ValidationChain []Validator

// Validate iterates through all validators in the chain.
// It stops and returns the first error encountered.
func (chain ValidationChain) Validate(req *UserRegistrationRequest) error {
	for _, validator := range chain {
		if err := validator.Validate(req); err != nil {
			return err // Return on first failure
		}
	}
	return nil // All validators passed
}

// --- 5. Usage Example ---

func main() {
	// Create a new validation chain
	registrationValidators := ValidationChain{
		&UsernameValidator{},
		&EmailValidator{},
		&PasswordStrengthValidator{},
		&PasswordMatchValidator{},
		&TOSAgreementValidator{},
	}

	// --- Test Case 1: Valid Request ---
	validReq := &UserRegistrationRequest{
		Username:        "john_doe",
		Email:           "john.doe@example.com",
		Password:        "SecureP@ss1",
		ConfirmPassword: "SecureP@ss1",
		AgreeToTOS:      true,
	}
	fmt.Println("--- Valid Request ---")
	err := registrationValidators.Validate(validReq)
	if err != nil {
		fmt.Printf("Validation Failed: %v\n", err)
	} else {
		fmt.Println("Validation Succeeded for validReq!")
	}
	fmt.Println(strings.Repeat("-", 30))

	// --- Test Case 2: Invalid Email ---
	invalidEmailReq := &UserRegistrationRequest{
		Username:        "jane_doe",
		Email:           "invalid-email", // <-- Invalid
		Password:        "StrongP@ss2",
		ConfirmPassword: "StrongP@ss2",
		AgreeToTOS:      true,
	}
	fmt.Println("--- Invalid Email Request ---")
	err = registrationValidators.Validate(invalidEmailReq)
	if err != nil {
		fmt.Printf("Validation Failed: %v\n", err)
	} else {
		fmt.Println("Validation Succeeded for invalidEmailReq!")
	}
	fmt.Println(strings.Repeat("-", 30))

	// --- Test Case 3: Missing TOS Agreement ---
	missingTOSReq := &UserRegistrationRequest{
		Username:        "bob_smith",
		Email:           "bob@example.com",
		Password:        "AnotherP@ss3",
		ConfirmPassword: "AnotherP@ss3",
		AgreeToTOS:      false, // <-- Missing agreement
	}
	fmt.Println("--- Missing TOS Agreement Request ---")
	err = registrationValidators.Validate(missingTOSReq)
	if err != nil {
		fmt.Printf("Validation Failed: %v\n", err)
	} else {
		fmt.Println("Validation Succeeded for missingTOSReq!")
	}
	fmt.Println(strings.Repeat("-", 30))

	// --- Test Case 4: Multiple failures (will stop at the first one) ---
	multipleFailuresReq := &UserRegistrationRequest{
		Username:        "a", // Too short
		Email:           "invalid",
		Password:        "weak",
		ConfirmPassword: "weak",
		AgreeToTOS:      false,
	}
	fmt.Println("--- Multiple Failures Request ---")
	err = registrationValidators.Validate(multipleFailuresReq)
	if err != nil {
		fmt.Printf("Validation Failed: %v\n", err) // Expect "username must be at least 3 characters long"
	} else {
		fmt.Println("Validation Succeeded for multipleFailuresReq!")
	}
	fmt.Println(strings.Repeat("-", 30))
}
```

---

### Explanation and Benefits:

1.  **`Validator` Interface:** This is the key. Any struct that implements the `Validate` method (`func (v *MyValidator) Validate(req *UserRegistrationRequest) error`) can be part of the chain. This provides strong type safety and extensibility.
2.  **Concrete Validators:** `EmailValidator`, `UsernameValidator`, etc., are simple structs that implement the `Validator` interface. Each has a single responsibility.
3.  **`ValidationChain` Type:** This is a slice of `Validator` interfaces. The `Validate` method on this type orchestrates the execution. It iterates through the slice, calling `Validate` on each, and immediately returns if an error occurs.
4.  **Flexibility:**
    - **Easy to add/remove rules:** Just add a new struct implementing `Validator` and include it in your `ValidationChain`.
    - **Easy to reorder rules:** Change the order in the `ValidationChain` slice. This is important if some validations are prerequisites for others (e.g., check for nil `User` before checking `User.ID`).
    - **Reusable Validators:** A `PasswordStrengthValidator` could be reused for different types of requests (e.g., password change, user creation).
5.  **Readability:** Each validator has a clear name and a focused task, making the validation logic easier to understand and maintain.
6.  **Fail-Fast:** The `ValidationChain.Validate` method stops at the first error, which is often desirable to avoid unnecessary processing and provide immediate feedback.

### Enhancements and Variations:

- **Collecting all errors:** Instead of failing fast, you might want to collect all validation errors. This would involve `ValidationChain.Validate` returning a slice of errors (`[]error`) or a custom error type that aggregates multiple errors.

  ```go
  // Example of collecting all errors
  type MultiError []error

  func (me MultiError) Error() string {
      var sb strings.Builder
      for i, err := range me {
          sb.WriteString(err.Error())
          if i < len(me)-1 {
              sb.WriteString("; ")
          }
      }
      return sb.String()
  }

  func (chain ValidationChain) ValidateAll(req *UserRegistrationRequest) error {
      var errors MultiError
      for _, validator := range chain {
          if err := validator.Validate(req); err != nil {
              errors = append(errors, err)
          }
      }
      if len(errors) > 0 {
          return errors
      }
      return nil
  }
  ```

- **Contextual Validators:** If some validators need external dependencies (e.g., a database connection to check for unique usernames), you can pass them to the validator's constructor or include them as fields in the validator struct.
  ```go
  type UniqueUsernameValidator struct {
      userRepository UserRepository
  }
  func (v *UniqueUsernameValidator) Validate(req *UserRegistrationRequest) error {
      if v.userRepository.Exists(req.Username) {
          return errors.New("username already taken")
      }
      return nil
  }
  // In main:
  // registrationValidators := ValidationChain{
  //     &UsernameValidator{},
  //     &UniqueUsernameValidator{userRepository: myDBRepo}, // Inject dependency
  //     // ...
  // }
  ```
- **Generics (Go 1.18+):** For validating different types of requests without code duplication, you could make the `Validator` interface and `ValidationChain` generic.

  ```go
  // Generic Validator
  type Validator[T any] interface {
      Validate(input T) error
  }

  // Generic ValidationChain
  type ValidationChain[T any] []Validator[T]

  func (chain ValidationChain[T]) Validate(input T) error {
      for _, validator := range chain {
          if err := validator.Validate(input); err != nil {
              return err
          }
      }
      return nil
  }

  // Then, your specific validators would implement Validator[*UserRegistrationRequest]
  type EmailValidator struct{}
  func (v *EmailValidator) Validate(req *UserRegistrationRequest) error { /* ... */ }
  ```

  This adds more flexibility but might also increase complexity if not all validators apply to all types.

This chain processor pattern is a robust and highly recommended way to structure complex input validations in Go.
