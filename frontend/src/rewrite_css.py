import os
import re

css_path = r"c:\Users\Blu-Ray\Desktop\FOE\Sem. 6\Software Engineering\Ctrl-Alt-Eat\frontend\src\index.css"

with open(css_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add CSS variable replacements
new_vars = """
/* ── CSS Custom Properties ────────── */
:root {
  --bg-primary: #FAF3E8;
  --bg-secondary: #F3E9DA;
  --bg-card: rgba(232, 146, 60, 0.08);
  --bg-card-hover: rgba(232, 146, 60, 0.12);
  --orange: #E8923C;
  --orange-dark: #C9792C;
  --orange-light: #F2A95B;
  --golden: #DAA520;
  --cream: #0E0C08;
  --cream-muted: rgba(14, 12, 8, 0.65);
  --cream-subtle: rgba(14, 12, 8, 0.4);
  --border: rgba(232, 146, 60, 0.3);
  --border-hover: rgba(232, 146, 60, 0.5);
  --success: #059669;
  --success-dark: #047857;
  --danger: #DC2626;
  --glass-color: 14, 12, 8;
  --orange-rgb: 232, 146, 60;
  --success-rgb: 5, 150, 105;
}

.dark {
  --bg-primary: #0E0C08;
  --bg-secondary: #16140E;
  --bg-card: rgba(232, 146, 60, 0.04);
  --bg-card-hover: rgba(232, 146, 60, 0.08);
  --orange: #E8923C;
  --orange-dark: #C9792C;
  --orange-light: #F2A95B;
  --golden: #DAA520;
  --cream: #FAF3E8;
  --cream-muted: rgba(250, 243, 232, 0.55);
  --cream-subtle: rgba(250, 243, 232, 0.25);
  --border: rgba(232, 146, 60, 0.12);
  --border-hover: rgba(232, 146, 60, 0.28);
  --success: #34D399;
  --success-dark: #059669;
  --danger: #F87171;
  --glass-color: 250, 243, 232;
  --orange-rgb: 232, 146, 60;
  --success-rgb: 52, 211, 153;
}
"""

# Replace the original :root block with the new vars
content = re.sub(r":root\s*\{[^}]+\}", new_vars.strip(), content, count=1)

# Now, substitute all hardcoded rgba(250, 243, 232, X) to rgba(var(--glass-color), X)
content = re.sub(r"rgba\(\s*250\s*,\s*243\s*,\s*232\s*,\s*([0-9.]+)\s*\)", r"rgba(var(--glass-color), \1)", content)

# Substitute all hardcoded rgba(232, 146, 60, X) to rgba(var(--orange-rgb), X)
content = re.sub(r"rgba\(\s*232\s*,\s*146\s*,\s*60\s*,\s*([0-9.]+)\s*\)", r"rgba(var(--orange-rgb), \1)", content)

# Substitute all hardcoded rgba(52, 211, 153, X) to rgba(var(--success-rgb), X)
content = re.sub(r"rgba\(\s*52\s*,\s*211\s*,\s*153\s*,\s*([0-9.]+)\s*\)", r"rgba(var(--success-rgb), \1)", content)

with open(css_path, "w", encoding="utf-8") as f:
    f.write(content)
