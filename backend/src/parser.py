from typing import Generator
import tree_sitter_python as tspython
from tree_sitter import Language, Parser, Tree, Node
from github import Github

g = Github()

class PythonLanguage:
    def __init__(self):
        self.name = 'Python'
        self.language = Language(tspython.language())
        self.wanted_nodes = ['function_definition', 'class_definition'] 
        self.metadata_nodes = ['decorated_definition', 'import_statement', 'import_from_statement']

class FileParser:
    def __init__(self):
        # Map each file extension to their respective language
        self.language_map = {
            '.py' : PythonLanguage()
        }
    
    def parse_file(self, file_content, file_path, file_extension):

        def traverse_tree(tree: Tree) -> Generator[Node, None, None]:
            cursor = tree.walk()

            visited_children = False
            while True:
                if not visited_children:
                    yield cursor.node
                    # DFS Search Part, keep going until we have reached a node with no children
                    if not cursor.goto_first_child():
                        visited_children = True
                # Breadth-wise movement
                elif cursor.goto_next_sibling():
                    visited_children = False
                # Returned to the root node, we can break
                elif not cursor.goto_parent():
                    break

        selected_language = self.language_map[file_extension]
        parser = Parser(selected_language.language)

        src = bytes(file_content, 'utf-8')
        tree = parser.parse(src, encoding="utf8")

        chunks = []
        for node in traverse_tree(tree):
            if node.type in selected_language.wanted_nodes:
                # Extract class or function name
                name_node = node.child_by_field_name("name")
                name = name_node.text.decode('utf-8') if name_node else "unknown"

                chunk = {
                    'content': node.text.decode('utf-8'),
                    'metadata': {
                        'type': node.type,
                        'name': name,
                        'file_path': file_path,
                        'start': node.start_point,
                        'end': node.end_point,
                    }
                }
                chunks.append(chunk)
        
        return chunks
        


file_content = ""

repo = g.get_repo(f"SahusBhandary-Student/test_repo")
contents = repo.get_contents('')
root_content = []
for content_file in contents:
    if content_file.type == 'file' and content_file.name == 'test_chunker.py':
        file_content = content_file.decoded_content.decode()

parser = FileParser()
parser.parse_file(file_content, 'test_chunker.py', '.py')






