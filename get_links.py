import sys
from wiki_dump_reader import Cleaner, iterate

cleaner = Cleaner()
for title, text in iterate(sys.argv[1]):
    text = cleaner.clean_text(text)
    cleaned_text, links = cleaner.build_links(text)
    for link in links:
        print(title, ';', link['link'], sep='')
