with open('.github/workflows/ci.yml', 'r') as f:
    content = f.read()

content = content.replace("true:", "on:")

with open('.github/workflows/ci.yml', 'w') as f:
    f.write(content)
