# Kitchen Display System (KDS)

A solid implementation of a Kitchen Display System using Django and React.

## Project Structure

- `backend/`: Django REST Framework API.
- `frontend/`: React + Tailwind CSS frontend.
- `docs/`: System documentation (requirements, design, validation).
- `backend/orders/tests/`: 18 Unit and Integration tests (70/20 logic).
- `frontend/tests/`: 2 Playwright Master Journey tests (10% E2E logic).
- `demo/`: Screenshots and video demonstrations.

## Testing & Validation (Phase 4)

### Backend (Unit & Integration)
```bash
cd backend
python manage.py test orders.tests
```

### Frontend (E2E Playwright)
```bash
cd frontend
npx playwright test
```

## Setup

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python manage.py migrate`
4. `python manage.py runserver`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`