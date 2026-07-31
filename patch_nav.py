import re
import sys

# 1. Update App.tsx
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app_content = f.read()

app_content = app_content.replace(
    "import JapCounter from './components/JapCounter';",
    "import JapCounter from './components/JapCounter';\nimport GuruSanidhya from './components/GuruSanidhya';"
)

app_content = app_content.replace(
    "{activePage === 'jap' && <JapCounter />}",
    "{activePage === 'jap' && <JapCounter />}\n            {activePage === 'sanidhya' && <GuruSanidhya />}"
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_content)

# 2. Update Navbar.tsx
with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    nav_content = f.read()

nav_content = nav_content.replace(
    "const navLinks = ['home', 'vaanis', 'calendar', 'philosophy', 'jap', 'community'];",
    "const navLinks = ['home', 'vaanis', 'calendar', 'philosophy', 'jap', 'sanidhya', 'community'];"
)

with open('src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(nav_content)

# 3. Update LanguageContext.tsx
with open('src/context/LanguageContext.tsx', 'r', encoding='utf-8') as f:
    lang_content = f.read()

lang_content = lang_content.replace(
    "'nav.naamJap': 'Naam Jap',",
    "'nav.naamJap': 'Naam Jap',\n    'nav.sanidhya': 'Guru Sanidhya',"
)
lang_content = lang_content.replace(
    "'nav.naamJap': 'नाम जप',",
    "'nav.naamJap': 'नाम जप',\n    'nav.sanidhya': 'गुरु सान्निध्य',"
)

with open('src/context/LanguageContext.tsx', 'w', encoding='utf-8') as f:
    f.write(lang_content)

print("SUCCESS")
