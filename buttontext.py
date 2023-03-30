with open('button_text.txt', 'w') as f:
    for i in range(276):
        button_text = f'<button class="mini sprite" data-index="{i}"></button>\n'
        f.write(button_text)
