from bs4 import BeautifulSoup
import requests
import os
import os.path
from itertools import product
# import time
from collections import defaultdict
import sys

"""
    NOTES: scoring algorithm can be improved through a back-propogation algorithm
        with a discriminator algorithm that checks whether or not the input array
        is in order from highest to lowest score
"""

# URL of the webpage to scrape
url = "https://www.ifelsemedia.com/swordandglory/perklist/"
file_path = "SkillTree\static\SkillTree\Saved_graph.txt"
class_list = [
    "cat_Occupation",   
    "cat_CombatSkill",
    "cat_Religion",
    "cat_Adventure",
    "cat_Clan",
    "cat_Personality",
]
trait_dict = {
    # Defence traits
    "health": [],
    "defense": [],
    "defense recovery"  : [],
    # Attacking traits 
    "dominance": [],
    "damage": [],
    "speed": [],
    "stamina": [],
    "stamina recovery": [],
    # Other
    "wealth": [],
    "glory": [],
    }
priority_list = ["dominance","damage","stamina","defense","stamina recovery","defense recovery","wealth","speed","health","glory",]
nlist = []
class TreeNode:
    def __init__(self, name, req, trait, score=0, depth=0):
        self.children = []
        self.name = name
        self.req = req
        self.trait = trait
        self.score = score
        self.num = 0        #assigns num in bfs order in assign_num
        self.depth = depth  #depth of node
        self.type = None    #lv 1 nodes's parent(aka cat_ node it came from)
    def copy_childless(self):
        return TreeNode(self.name, self.req, self.trait, self.score)
    
    def add_child(self,new_child):
        self.children.append(new_child)
    # Given the name of the child, finds and removes the child from the list
    def remove_child(self,child_name):
        for c in self.children:
            if c.name == child_name:
                self.children.remove(c)
                print("Removed", c.name, "from", self.name)
                return
        
###############################################################################################
#                                   TREE FUNCTIONS
###############################################################################################
def find_name(root, target_name):
    if root is None:
        return None
    if target_name == root.name:
        return root
    # Recursively search in the children of the current node
    for child in root.children:
        result = find_name(child, target_name)
        if result:
            return result
    return None
# Assumes all required nodes are contained in the list
# Will recursively go forever if exception
def add_node(root, new_node, list=None):  
    # Adds class_name to root node 
    if new_node.req is None:
        # remove from "adventure", "freed slave", "occupation, "combat skill"
        exceptions = ["cat_Occupation", "cat_CombatSkill"]
        if new_node.name == "cat_Adventure":
            return 
        if not any(new_node.name ==  i for i in exceptions):
            new_node.type = new_node.name
        # print(f"    {root.name} -> {new_node.name}")
        root.children.append(new_node)
        
        return
    
    # For level 1 skills
    elif len(new_node.req) <= 1:
        root.children.append(new_node)
        if new_node.name != "Freed Slave":
            new_node.type = root.type
        # print(f"    {root.name} -> {new_node.name}")
        return
    parent_node = find_name(root, new_node.req[1])
    if parent_node:
        # print(f"    {parent_node.name} -> {new_node.name}")
        parent_node.children.append(new_node)
        # new_node.type = parent_node.type
        return
    else:
        # print(f" x  \"{new_node.req[1]}\" not found.")
        if list:
            list.append(new_node)  
        else:
            print(f" x  \"{new_node.req[1]}\" not found.")
def assign_num(root):
    """Assigns num and depth to all nodes in a tree and returns tree size"""
    if root is None:
        return 0
    queue = []
    queue.append(root)
    count = 0 
    depth = 0
    while queue:
        level_size = len(queue)
        depth += 1 
        
        for _ in range(level_size):
            node = queue.pop(0)
            node.num = count
            node.depth = depth
            count += 1
            nlist.append(node)
            
            for child in node.children:
                queue.append(child)
    return count
# gives score to all nodes with the higher score indicating better placement(change to lower)
def score_nodes(trait_dict,size):
    priority_weight = 0.5
    rank_weight = 0.4
    level_weight = 0.1
    max_score = 105
    modifier = 5
    score_list = [0]*size
    for trait in trait_dict:
        lst = trait_dict.get(trait)
        priority_val = modifier * (len(priority_list) - priority_list.index(trait))/len(priority_list)
        rank_max = int(lst[-1].trait.split(' ')[0].strip(' +%'))
        
        if len(lst) == 0: 
            continue
        
        # level ups at: 1,4,8,13
        for skill in lst:
            level_val = skill.req[0].strip("Level ")
            if level_val == "Specia":
                skill.score = 1000
                continue
            level_val = modifier - ((modifier/4) * (int(level_val)//4))
            rank_val = modifier * int(skill.trait.split(' ')[0].strip(' +%')) / rank_max
            score_val = '%.2f'%((priority_weight * priority_val) + (rank_weight * rank_val) + (level_weight * level_val))
            
            # # conditionals(modifications to score)
            # t = skill.trait.lower()
            # if " to " in t:
            #     # EX: +6% speed to Fast attack
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            # elif " vs " in t:
            #     # EX: +40% Glory VS opponents of lower level
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            # elif " when " in t:
            #     # EX: +6 Stamina when winning
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            # elif " for " in t:
            #     # EX: +4 Dominance for first 15 seconds
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            # elif " while " in t:
            #     # EX: +4 Defense while blocking
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            # elif " random " in t:
            #     # EX: +4 Damage at random intervals
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            # else:
            #     skill.score = max_score - int(round(float(score_val) * 10,0))
            
            skill.score = max_score - int(round(float(score_val) * 10,0))
            score_list[skill.num] = skill.score
            # print statements
            # print(f"P:{modifier} * {(len(priority_list) - priority_list.index(trait))}/{len(priority_list)} = {priority_val}") #priority
            # print(f"R:{modifier} * {int(skill.trait.split(' ')[0].strip(' +%'))} / {rank_max} = {rank_val}") #rank
            # print(f"L:{modifier} - {(modifier/4)} * {(int(level_val)//4)} = {level_val}") #level
            # print(f"{skill.name}[{100-skill.score}] = ({priority_weight} * {priority_val}) + ({rank_weight} * {rank_val}) + ({level_weight} * {level_val})")
        # print("\n")
    return score_list
###############################################################################################
#                                   TRAIT LIST FUNCTIONS
###############################################################################################
def add_trait(node):
    if "health" in node.trait.lower():
        trait_dict["health"].append(node)
    elif "dominance" in node.trait.lower():
        trait_dict["dominance"].append(node)
    elif "damage" in node.trait.lower():
        trait_dict["damage"].append(node)
    elif "defense recovery" in node.trait.lower():
        trait_dict["defense recovery"].append(node)
    elif "stamina recovery" in node.trait.lower():
        trait_dict["stamina recovery"].append(node)
    elif "stamina" in node.trait.lower():
        trait_dict["stamina"].append(node)
    elif "money" in node.trait.lower():
        trait_dict["wealth"].append(node)
    elif "glory" in node.trait.lower():
        trait_dict["glory"].append(node)
    elif "speed" in node.trait.lower():
        trait_dict["speed"].append(node)
    elif "defense" in node.trait.lower():
        trait_dict["defense"].append(node)
    else:
        # print(f"Failed {node.name}")
        node.score = 1
        return
###############################################################################################
#                                   PRINTING FUNCTIONS
###############################################################################################
def print_nary_tree(node, depth=0, show=False):
    if node:
        # Print the current node's value at the current depth
        print("    ",end="")
        if show:
            print("    " * depth + "#" + str(node.num) + " " + str(node.name) + " (" + str(node.score) + ")" "_" + str(node.depth) + "-" + str(node.type))
        else: 
            print("    " * depth + str(node.name) + "_" + str(node.depth))
        # Recursively print the children of the current node
        for child in node.children:
            print_nary_tree(child, depth + 1, show)
def print_list(list, showScores = False):
    print("List: [",end="")
    if showScores:
        for node in list:
            print(node.name,"(",node.score,")",end=", ")
    else: 
        for node in list:
            print(node.name,end=", ")
    print("]")
def print_dict(dictionary):
    print(f"List: [",end="")
    for _, value in dictionary.items():
        print(f"{value.name}",end=", ")
    print(f"] Length: {len(dictionary)}")
###############################################################################################
#                                   NEW FUNCTIONS
###############################################################################################
# returns path required to get to a node
def find_path(root, target_name, list):
    if root is None:    
        return None
    list.append(root)
    if target_name == root.name:
        return True
    for child in root.children:
        child_path = find_path(child, target_name, list)
        if child_path:
            return True
    # If the target is not found in any child, return an empty list
    list.pop(-1)
    return None
def translate_to_graph(root):
    if root is None:
        return
    queue = []
    queue.append((root, None))  # Storing (node, parent) tuples
    adj_list = defaultdict(list)
    while queue:
        node, parent = queue.pop(0)
        
        if parent:
            adj_list[parent.num].append(node.num)
            # adj_list[node.name].append(parent.name) #appends parent to adjlist
        for child in node.children:
            queue.append((child, node))  # Pass the child node and its parent
    # for node, neighbors in adj_list.items():
    #     print(f"({node}): {neighbors}")
    return adj_list
def find_best(graph, score_list,size, k):   
    
    # finds smallest sum score of k total connected nodes in graph 
    def dp(graph, score_list,size, k):
        N = k       #number of classes you can take
        M = size       #total number of classes
        children = graph
        power = score_list
        # Initialize a 2D array to store the maximum value and the selected nodes
        dp = [[(1000, []) for _ in range(N+1)] for _ in range(M)]
        def dfs(node):
            dp[node][1] = (power[node], [node]) 
            for child in children[node]:
                dfs(child)
                for i in range(N, 0, -1):
                    for j in range(i):
                        value = dp[node][i-j][0] + dp[child][j][0]
                        nodes = dp[node][i-j][1] + dp[child][j][1]
                        if value < dp[node][i][0]: #discriminate here
                            dp[node][i] = (value, nodes)
        dfs(0)
        return dp[0][N]
    
    # return all combinations of level 1 nodes and base to dp and find best one overall
    """
        1: cat_Occupation
        2: cat_CombatSkill
    X 3: cat_Religion
    X 4: cat_Clan
    X 5: cat_Personality
    """
    l = []
    g = []
    graph_1 = graph
    for i in [1,2,3,4,5]:
        if i == 3 or i == 4 or i == 5:
            temp = []
            for z in graph[i]:
                temp.append(z)
            g.append(temp)
        else:
            for z in graph[i]:
                l.append(z)
        graph_1.pop(i)
        # removes node from base's children
        graph_1[0].remove(i)
    
#evaluates static l + combo list(every combination of religion, personality, clan) and executes dp alg. 180 times
    solution = sys.maxsize
    nodes = 0
    for combo in product(g[0], g[1], g[2]):        
        graph_1[0] = l.copy()
        for i in combo:
            graph_1[0] += graph[i]
        max_value, selected_nodes = dp(graph_1, score_list,size, k)
        # print([nlist[i].name for i in selected_nodes] + [nlist[i].name for i in combo], max_value + sum([nlist[i].score for i in combo]))
        
        if solution > max_value + sum([nlist[i].score for i in combo]):
            solution = max_value + sum([nlist[i].score for i in combo])
            nodes = selected_nodes + list(combo)
    return(solution,nodes)
###############################aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa################################################################
#                                   DRIVER CODE
###############################################################################################
def optimizeSkills( k : int ):
    head = TreeNode("base",None,None)
    node_list = []
    if not os.path.isfile(file_path):
        open(file_path, "x")
    if os.path.getsize(file_path) == 0:
        response = requests.get(url)
        response.raise_for_status()
        file = open(file_path, "wb")
        file.write(response.content)
        file.close()
        
        # Parse the HTML content with Beautiful Soup
        soup = BeautifulSoup(response.text, "html.parser")
        print("Read from webpage")
    else:
        # Read from file if 
        with open(file_path, 'r', encoding='utf-8') as file:
            # Parse the HTML content of the file using Beautiful Soup
            soup = BeautifulSoup(file, 'html.parser')
        print("Read from file")
    for class_name in class_list:
        # Find all HTML elements with the specified class
        elements_with_class = soup.find_all(class_=class_name)
        # print(f"\nText content from class '{class_name}':")
        class_node = TreeNode(class_name, None, None)
        add_node(head,class_node,None)
        for element in elements_with_class:
            # print(f"{element}")  # Use .strip() to remove leading/trailing whitespace
            name = element.find('h2').text
            # print(f"    {element.find('h4').text}")
            req = element.find('p').text[14:].split(", ")
            trait = element.find('p').find_next_sibling('p').find_next_sibling('p').text
            if len(trait) == 0: 
                trait = "N/A"
            
            new_node = TreeNode(name, req, trait)
            node_list.append(new_node)
            add_trait(new_node)
        
        # sort the node list by req
        node_list = sorted(node_list, key=lambda x: x.depth)
        #loops unadded nodes to trees until added
        for node in node_list:
            add_node(class_node, node, node_list)
        node_list = []
    size = assign_num(head)
    # sorting alphabetically does not work, convert to number then sort
    for key in trait_dict:
        trait_dict[key].sort(key=lambda x: float(x.trait.split(" ", 1)[0].replace("%","")))
    score_li = score_nodes(trait_dict,size)
    max_value, selected_nodes = find_best(translate_to_graph(head), score_li,size, k)

    result = []
    print(selected_nodes)
    #sort nodes by cat_ and level req
    for i in selected_nodes:
        result.append((score_li[i], nlist[i].name))
    return result
    # return ([score_li[i] for i in selected_nodes], [nlist[i].name for i in selected_nodes])

# print(optimizeSkills(5))                   #Debug