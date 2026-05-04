# StellarU Smart Contract Reference

All contracts are located in `contracts/<name>/src/lib.rs` and compile to `wasm32-unknown-unknown`.

---

## student_registry

Stores the canonical student record for each registered wallet.

| Function | Auth | Description |
|---|---|---|
| `initialize(admin)` | admin | One-time setup |
| `register(student, matric, first_name, last_name, department, level)` | student | Register a new student |
| `get_student(address)` | none | Read student record |
| `update_status(caller, student, status)` | admin | Change student status |
| `update_level(caller, student, level)` | admin | Advance student level |
| `count()` | none | Total registered students |
| `bump_expiry(subject)` | none | Extend persistent TTL by ~1 year |

**Errors:** `AlreadyInitialized`, `NotInitialized`, `Unauthorized`, `StudentNotFound`, `MatricTaken`

---

## course_registry

Stores all course offerings and lecturer assignments.

| Function | Auth | Description |
|---|---|---|
| `initialize(admin)` | admin | One-time setup |
| `add_course(caller, code, title, department, units, level, semester)` | admin | Add a course |
| `assign_lecturer(caller, code, lecturer)` | admin | Assign lecturer to course |
| `deactivate(caller, code)` | admin | Deactivate a course |
| `get_course(code)` | none | Read course record |
| `count()` | none | Total courses |
| `bump_expiry(code)` | none | Extend TTL |

---

## enrollment

Session-scoped course registration records.

| Function | Auth | Description |
|---|---|---|
| `initialize(admin, tuition_contract)` | admin | Setup with tuition contract reference |
| `enroll(student, course, session, semester)` | student | Enroll in a course |
| `withdraw(student, course, session, semester)` | student | Withdraw enrollment |
| `mark_graded(caller, student, course, session, semester)` | admin | Mark enrollment as graded |
| `get_enrollment(student, course, session, semester)` | none | Read enrollment |
| `count()` | none | Total enrollments |
| `bump_expiry(student, course, session, semester)` | none | Extend TTL |

---

## tuition

USDC fee collection using Stellar's native token interface.

| Function | Auth | Description |
|---|---|---|
| `initialize(admin, token, treasury)` | admin | Setup |
| `pay(student, session, semester)` | student | Pay tuition for a semester |
| `is_paid(student, session, semester)` | none | Check payment status |
| `get_payment(student, session, semester)` | none | Read payment record |
| `get_fee(level)` | none | Get fee for a level |
| `set_fee(caller, level, amount)` | admin | Update fee |

**Default fees:** 100-200L = 1,500,000,000 stroops (1,500 USDC), 300-400L = 2,000,000,000, 500-600L = 2,500,000,000, 700L+ = 3,000,000,000

---

## grading

Grade submission from assigned lecturers.

| Function | Auth | Description |
|---|---|---|
| `initialize(admin)` | admin | Setup |
| `submit_grade(caller, student, course, session, semester, score)` | admin/lecturer | Submit a grade |
| `get_grade(student, course, session, semester)` | none | Read grade record |
| `count()` | none | Total grades submitted |

**Grade mapping:** 70-100 → A/5.0, 60-69 → B/4.0, 50-59 → C/3.0, 45-49 → D/2.0, 40-44 → E/1.0, <40 → F/0.0

---

## credential

Verifiable on-chain credential issuance and revocation.

| Function | Auth | Description |
|---|---|---|
| `initialize(admin)` | admin | Setup |
| `issue(caller, holder, type, ipfs_cid, degree_class, session)` | admin | Issue a credential, returns SHA-256 ID |
| `verify(id)` | none | Returns true if credential exists and is not revoked |
| `batch_verify(ids)` | none | Verify up to 10 credentials in one call |
| `get(id)` | none | Read full credential record |
| `revoke(caller, id)` | admin | Revoke a credential |

---

## scholarship

GPA-gated grant pools with on-chain disbursement.

| Function | Auth | Description |
|---|---|---|
| `initialize(admin, token)` | admin | Setup |
| `create_scholarship(caller, name, amount, min_gpa, max_awards)` | admin | Create a new pool |
| `award(caller, scholarship_id, student)` | admin | Disburse to student (GPA checked) |

---

## governance

Council-based on-chain governance with quorum voting.

| Function | Auth | Description |
|---|---|---|
| `initialize(admin, council)` | admin | Setup with council member list |
| `propose(proposer, title, description, duration, quorum)` | council/admin | Create proposal |
| `vote(voter, proposal_id, support)` | council/admin | Vote for or against |
| `execute(caller, id)` | admin | Execute a passed proposal |
| `cancel(caller, id)` | admin | Cancel a proposal |
| `get_proposal(id)` | none | Read proposal |

---

## identity

`did:stellar` DID primitive.

| Function | Auth | Description |
|---|---|---|
| `initialize(admin)` | admin | Setup |
| `register_did(subject, service_urls)` | subject | Register DID document |
| `update_service_urls(subject, service_urls)` | subject | Update service endpoints |
| `deactivate(subject)` | subject | Deactivate DID |
| `resolve(subject)` | none | Resolve DID document |
| `add_trusted_issuer(caller, issuer)` | admin | Mark an address as trusted issuer |
| `remove_trusted_issuer(caller, issuer)` | admin | Remove trusted issuer |
| `is_trusted_issuer(issuer)` | none | Check trusted issuer status |

---

## anchor

SEP-31 USDC escrow for cross-border tuition payments.

| Function | Auth | Description |
|---|---|---|
| `initialize(admin, operator, token, tuition_contract)` | admin | Setup |
| `initiate_transfer(operator, tx_id, sender, recipient, amount, memo)` | operator/admin | Create escrow transfer |
| `complete_transfer(operator, tx_id)` | operator/admin | Release USDC to recipient |
| `refund(operator, tx_id)` | operator/admin | Refund to sender |
| `get_transfer(tx_id)` | none | Read transfer record |
| `transfer_count()` | none | Total transfers |

**TTL:** Transfers expire after 24 hours if not completed.
