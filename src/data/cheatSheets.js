export const cheatSheets = {
  python: {
    dataTypes: {
      title: "Data Types",
      details: [
        { concept: "Primitives", code: "x = 42          # int\ny = 3.14        # float\nz = \"CodeLens\"  # str\nis_active = True # bool" },
        { concept: "Collections", code: "lst = [1, 2, 3]            # List (mutable)\ntpl = (1, 2, 3)            # Tuple (immutable)\ndct = {\"key\": \"value\"}     # Dictionary\nst = {1, 2, 3}             # Set (unique)" }
      ]
    },
    controlFlow: {
      title: "Control Flow",
      details: [
        { concept: "Conditionals", code: "if x > 10:\n    print(\"Greater\")\nelif x == 10:\n    print(\"Equal\")\nelse:\n    print(\"Lesser\")" },
        { concept: "Loops", code: "for item in lst:\n    print(item)\n\nwhile x > 0:\n    x -= 1" }
      ]
    },
    functions: {
      title: "Functions",
      details: [
        { concept: "Definition", code: "def greet(name, prefix=\"Hello\"):\n    return f\"{prefix}, {name}!\"\n\n# Calling\nmsg = greet(\"Alice\")" },
        { concept: "Lambdas", code: "square = lambda x: x ** 2\nresult = square(5) # 25" }
      ]
    },
    commonMethods: {
      title: "Common Methods",
      details: [
        { concept: "String Handling", code: "\"hello\".upper()          # \"HELLO\"\n\"a-b-c\".split(\"-\")       # ['a', 'b', 'c']\n\" \".join([\"A\", \"B\"])     # \"A B\"" },
        { concept: "List Manipulation", code: "lst.append(4)            # Add to end\nlst.insert(0, 9)         # Insert at index\nitem = lst.pop()         # Remove & return last" }
      ]
    },
    errorHandling: {
      title: "Error Handling",
      details: [
        { concept: "Try / Except", code: "try:\n    val = 10 / 0\nexcept ZeroDivisionError as err:\n    print(f\"Caught: {err}\")\nexcept Exception as err:\n    print(f\"Other error: {err}\")\nfinally:\n    print(\"Cleanup block\")" }
      ]
    }
  },
  javascript: {
    dataTypes: {
      title: "Data Types",
      details: [
        { concept: "Variables", code: "const x = 42;         // Block-scoped constant\nlet name = \"Alice\";   // Mutable variable" },
        { concept: "Types", code: "const num = 3.14;         // Number\nconst isOk = true;        // Boolean\nconst sym = Symbol('id'); // Symbol\nconst obj = { k: 'v' };   // Object\nconst arr = [1, 2, 3];    // Array (type of Object)" }
      ]
    },
    controlFlow: {
      title: "Control Flow",
      details: [
        { concept: "Conditionals", code: "if (x > 10) {\n  console.log(\"Greater\");\n} else if (x === 10) {\n  console.log(\"Equal\");\n} else {\n  console.log(\"Lesser\");\n}" },
        { concept: "Loops", code: "for (let i = 0; i < arr.length; i++) {\n  console.log(arr[i]);\n}\n\nfor (const item of arr) {\n  console.log(item);\n}" }
      ]
    },
    functions: {
      title: "Functions",
      details: [
        { concept: "Declarations", code: "function add(a, b) {\n  return a + b;\n}" },
        { concept: "Arrow & Expressions", code: "const multiply = (a, b) => a * b;\nconst square = x => x * x;" }
      ]
    },
    commonMethods: {
      title: "Common Methods",
      details: [
        { concept: "Array Methods", code: "arr.map(x => x * 2);      // Returns [2, 4, 6]\narr.filter(x => x > 1);   // Returns [2, 3]\narr.reduce((sum, val) => sum + val, 0); // Returns 6" },
        { concept: "String Handling", code: "\"hello\".toUpperCase();   // \"HELLO\"\n\"a,b\".split(\",\");        // ['a', 'b']\n\"abc\".includes(\"b\");     // true" }
      ]
    },
    errorHandling: {
      title: "Error Handling",
      details: [
        { concept: "Try / Catch", code: "try {\n  throw new Error(\"Oops!\");\n} catch (error) {\n  console.error(error.message);\n} finally {\n  console.log(\"Execution completed\");\n}" }
      ]
    }
  },
  typescript: {
    dataTypes: {
      title: "Data Types",
      details: [
        { concept: "Type Annotations", code: "let name: string = \"Alice\";\nlet count: number = 42;\nlet isActive: boolean = true;" },
        { concept: "Advanced Types", code: "let list: number[] = [1, 2, 3];\nlet tuple: [string, number] = [\"age\", 30];\ninterface User { id: number; name: string; }" }
      ]
    },
    controlFlow: {
      title: "Control Flow",
      details: [
        { concept: "Conditionals & Loops", code: "// Same syntax as JavaScript\nif (isActive) {\n  for (let num of list) {\n    console.log(num);\n  }\n}" }
      ]
    },
    functions: {
      title: "Functions",
      details: [
        { concept: "Typed Signatures", code: "function greet(name: string, prefix?: string): string {\n  return `${prefix || 'Hello'}, ${name}!`;\n}" },
        { concept: "Generics", code: "function identity<T>(arg: T): T {\n  return arg;\n}" }
      ]
    },
    commonMethods: {
      title: "Common Methods",
      details: [
        { concept: "Utility Types", code: "type PartialUser = Partial<User>; // All keys optional\ntype ReadonlyUser = Readonly<User>; // Cannot mutate" }
      ]
    },
    errorHandling: {
      title: "Error Handling",
      details: [
        { concept: "Try & Type assertion", code: "try {\n  // throw...\n} catch (error) {\n  if (error instanceof Error) {\n    console.log(error.message);\n  }\n}" }
      ]
    }
  },
  cpp: {
    dataTypes: {
      title: "Data Types",
      details: [
        { concept: "Primitives", code: "int age = 25;\ndouble pi = 3.14159;\nchar grade = 'A';\nbool isValid = true;" },
        { concept: "Standard Library", code: "#include <string>\n#include <vector>\nstd::string text = \"Hello\";\nstd::vector<int> numbers = {1, 2, 3};" }
      ]
    },
    controlFlow: {
      title: "Control Flow",
      details: [
        { concept: "Conditionals", code: "if (age >= 18) {\n  std::cout << \"Adult\";\n} else {\n  std::cout << \"Minor\";\n}" },
        { concept: "Loops", code: "for (int i = 0; i < 5; ++i) {\n  std::cout << i;\n}\n\nfor (int n : numbers) {\n  std::cout << n;\n}" }
      ]
    },
    functions: {
      title: "Functions",
      details: [
        { concept: "Declaration", code: "int add(int a, int b) {\n  return a + b;\n}" },
        { concept: "Passing by Reference", code: "void update(int& value) {\n  value *= 2;\n}" }
      ]
    },
    commonMethods: {
      title: "Common Methods",
      details: [
        { concept: "Vector Methods", code: "numbers.push_back(4);     // Append element\nnumbers.size();           // Get size\nnumbers.clear();          // Empty vector" },
        { concept: "String Handling", code: "text.length();           // Length of string\ntext.substr(0, 3);        // Substring" }
      ]
    },
    errorHandling: {
      title: "Error Handling",
      details: [
        { concept: "Exception Blocks", code: "try {\n  throw std::runtime_error(\"Fatal Error\");\n} catch (const std::exception& e) {\n  std::cerr << e.what();\n}" }
      ]
    }
  },
  java: {
    dataTypes: {
      title: "Data Types",
      details: [
        { concept: "Primitives", code: "int count = 100;\ndouble price = 19.99;\nboolean isNew = false;\nchar initial = 'J';" },
        { concept: "Objects & Lists", code: "String text = \"Java\";\nList<Integer> list = new ArrayList<>();" }
      ]
    },
    controlFlow: {
      title: "Control Flow",
      details: [
        { concept: "If / Else", code: "if (count > 50) {\n  System.out.println(\"High\");\n} else {\n  System.out.println(\"Low\");\n}" },
        { concept: "Loops", code: "for (int i = 0; i < 5; i++) {\n  System.out.println(i);\n}\n\nfor (int num : list) {\n  System.out.println(num);\n}" }
      ]
    },
    functions: {
      title: "Functions",
      details: [
        { concept: "Methods", code: "public int multiply(int a, int b) {\n  return a * b;\n}" },
        { concept: "Static Methods", code: "public static void greet(String name) {\n  System.out.println(\"Hello \" + name);\n}" }
      ]
    },
    commonMethods: {
      title: "Common Methods",
      details: [
        { concept: "String Operations", code: "text.length();             // String length\ntext.equals(\"Java\");       // Equality\ntext.substring(0, 2);      // \"Ja\"" },
        { concept: "Collections", code: "list.add(10);              // Append element\nlist.size();               // Array size\nlist.contains(10);         // Membership test" }
      ]
    },
    errorHandling: {
      title: "Error Handling",
      details: [
        { concept: "Exceptions", code: "try {\n  int result = 10 / 0;\n} catch (ArithmeticException e) {\n  System.err.println(e.getMessage());\n} finally {\n  System.out.println(\"Cleanup\");\n}" }
      ]
    }
  },
  go: {
    dataTypes: {
      title: "Data Types",
      details: [
        { concept: "Primitives", code: "var x int = 42\ny := 3.14             // Type inference\nname := \"Go Gopher\"\nisOk := true" },
        { concept: "Collections", code: "var arr [5]int        // Fixed-size array\nslice := []int{1, 2}  // Dynamic slice\nm := map[string]int{\"age\": 30}" }
      ]
    },
    controlFlow: {
      title: "Control Flow",
      details: [
        { concept: "Conditionals", code: "if x > 10 {\n  fmt.Println(\"Greater\")\n} else {\n  fmt.Println(\"Lesser\")\n}" },
        { concept: "Loops", code: "for i := 0; i < 5; i++ {\n  fmt.Println(i)\n}\n\nfor index, val := range slice {\n  fmt.Printf(\"%d: %d\\n\", index, val)\n}" }
      ]
    },
    functions: {
      title: "Functions",
      details: [
        { concept: "Multiple Returns", code: "func divide(a, b float64) (float64, error) {\n  if b == 0 {\n    return 0, errors.New(\"division by zero\")\n  }\n  return a / b, nil\n}" }
      ]
    },
    commonMethods: {
      title: "Common Methods",
      details: [
        { concept: "Slice Actions", code: "slice = append(slice, 3)  // Append value\nlen(slice)                // Size of slice" },
        { concept: "Map Access", code: "val, ok := m[\"age\"]       // Key existence check\ndelete(m, \"age\")          // Remove key" }
      ]
    },
    errorHandling: {
      title: "Error Handling",
      details: [
        { concept: "Explicit Checking", code: "val, err := divide(10, 0)\nif err != nil {\n  log.Println(\"Error:\", err)\n  return\n}\nfmt.Println(val)" }
      ]
    }
  },
  rust: {
    dataTypes: {
      title: "Data Types",
      details: [
        { concept: "Variables & Types", code: "let x = 42;                 // Immutable\nlet mut y = 3.14;           // Mutable\nlet is_ok: bool = true;" },
        { concept: "Collections", code: "let arr: [i32; 3] = [1, 2, 3]; // Array\nlet v: Vec<i32> = vec![1, 2]; // Vector" }
      ]
    },
    controlFlow: {
      title: "Control Flow",
      details: [
        { concept: "Conditionals & Match", code: "if x > 10 {\n  println!(\"Greater\");\n}\n\nmatch x {\n  1 => println!(\"One\"),\n  _ => println!(\"Other\"),\n}" },
        { concept: "Loops", code: "for i in 0..5 {\n  println!(\"{}\", i);\n}\n\nwhile mut_val > 0 {\n  mut_val -= 1;\n}" }
      ]
    },
    functions: {
      title: "Functions",
      details: [
        { concept: "Declarations", code: "fn add(a: i32, b: i32) -> i32 {\n  a + b // Implicit return (no semicolon)\n}" }
      ]
    },
    commonMethods: {
      title: "Common Methods",
      details: [
        { concept: "Vector Actions", code: "v.push(3);                // Append element\nv.len();                  // Get length" },
        { concept: "String Manipulation", code: "let s = String::from(\"hello\");\ns.push_str(\" world\");" }
      ]
    },
    errorHandling: {
      title: "Error Handling",
      details: [
        { concept: "Option & Result Match", code: "let file = std::fs::File::open(\"test.txt\");\nmatch file {\n  Ok(f) => println!(\"Opened successfully\"),\n  Err(e) => println!(\"Failed to open: {}\", e),\n}" }
      ]
    }
  }
};
