import json
import random
import datetime

# Realistic names lists
first_names = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
    "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
    "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
    "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
    "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah",
    "Ronald", "Stephanie", "Timothy", "Rebecca", "Jason", "Sharon", "Jeffrey", "Laura", "Ryan", "Cynthia",
    "Jacob", "Kathleen", "Gary", "Amy", "Nicholas", "Shirley", "Eric", "Angela", "Jonathan", "Helen",
    "Stephen", "Anna", "Larry", "Brenda", "Justin", "Pamela", "Scott", "Nicole", "Brandon", "Emma",
    "Benjamin", "Samantha", "Samuel", "Katherine", "Gregory", "Christine", "Frank", "Debra", "Alexander", "Rachel",
    "Raymond", "Catherine", "Patrick", "Carolyn", "Jack", "Janet", "Dennis", "Ruth", "Jerry", "Maria",
    "Tyler", "Heather", "Aaron", "Diane", "Jose", "Virginia", "Adam", "Julie", "Henry", "Joyce",
    "Nathan", "Victoria", "Douglas", "Olivia", "Zachary", "Kelly", "Peter", "Christina", "Kyle", "Lauren",
    "Walter", "Joan", "Ethan", "Evelyn", "Jeremy", "Judith", "Harold", "Megan", "Keith", "Cheryl",
    "Christian", "Andrea", "Roger", "Hannah", "Noah", "Martha", "Gerald", "Jacqueline", "Carl", "Frances",
    "Terry", "Gloria", "Sean", "Ann", "Austin", "Teresa", "Arthur", "Kathryn", "Lawrence", "Sara",
    "Jesse", "Janice", "Dylan", "Jean", "Bryan", "Alice", "Joe", "Madison", "Jordan", "Doris",
    "Billy", "Abigail", "Bruce", "Julia", "Albert", "Judy", "Willie", "Grace", "Gabriel", "Denise",
    "Logan", "Amber", "Alan", "Marilyn", "Juan", "Beverly", "Wayne", "Danielle", "Roy", "Theresa",
    "Ralph", "Sophia", "Randy", "Marie", "Eugene", "Diana", "Vincent", "Brittany", "Russell", "Natalie",
    "Elijah", "Isabella", "Louis", "Charlotte", "Bobby", "Rose", "Philip", "Alexis", "Johnny", "Kayla"
]

last_names = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
    "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
    "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King",
    "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter",
    "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins",
    "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey",
    "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez",
    "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross",
    "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington",
    "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes",
    "Myers", "Ford", "Hamilton", "Graham", "Sullivan", "Wallace", "Woods", "Cole", "West", "Jordan",
    "Owens", "Reynolds", "Fisher", "Ellis", "Harrison", "Gibson", "Mcdonald", "Cruz", "Marshall", "Ortiz",
    "Gomez", "Murray", "Freeman", "Wells", "Webb", "Simpson", "Stevens", "Tucker", "Porter", "Hunter",
    "Hicks", "Crawford", "Henry", "Boyd", "Mason", "Morales", "Kennedy", "Warren", "Dixon", "Ramos",
    "Reyes", "Burns", "Gordon", "Shaw", "Holmes", "Rice", "Robertson", "Hunt", "Black", "Daniels",
    "Palmer", "Mills", "Nichols", "Grant", "Knight", "Ferguson", "Rose", "Stone", "Hawkins", "Dunn",
    "Perkins", "Hudson", "Spencer", "Gardner", "Stephens", "Payne", "Pierce", "Berry", "Matthews", "Arnold",
    "Wagner", "Willis", "Ray", "Watkins", "Olson", "Carroll", "Duncan", "Snyder", "Hart", "Cunningham",
    "Bradley", "Lane", "Andrews", "Ruiz", "Harper", "Fox", "Riley", "Armstrong", "Carpenter", "Weaver",
    "Greene", "Lawrence", "Elliott", "Chavez", "Sims", "Austin", "Peters", "Kelley", "Franklin", "Lawson"
]

# Content Data
content_categories = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Romance", "Documentary", "Thriller"]
platforms = ["Netflix", "Prime Video", "Hulu", "Disney+"]
content_titles = [
    "Stranger Things", "The Crown", "Ozark", "The Witcher", "Bridgerton", "Squid Game", "Money Heist",
    "The Boys", "The Marvelous Mrs. Maisel", "Jack Ryan", "Reacher", "Wheel of Time", "Fleabag",
    "The Handmaid's Tale", "Only Murders in the Building", "The Bear", "Succession", "Ted Lasso",
    "The Mandalorian", "WandaVision", "Loki", "Andor", "Obi-Wan Kenobi", "Ahsoka",
    "Breaking Bad", "Game of Thrones", "The Sopranos", "The Wire", "Better Call Saul", "Avatar: The Last Airbender",
    "Inception", "Interstellar", "The Dark Knight", "Parasite", "Pulp Fiction", "The Godfather",
    "Avengers: Endgame", "Spider-Man: No Way Home", "Black Panther", "Guardians of the Galaxy"
]

def generate_users(num_users=1000):
    users = []
    for i in range(num_users):
        first = random.choice(first_names)
        last = random.choice(last_names)
        username = f"{first}{last}{random.randint(10, 999)}"
        email = f"{username.lower()}@example.com"
        
        # Generate viewing history
        history = []
        num_history = random.randint(5, 20)
        for _ in range(num_history):
            title = random.choice(content_titles)
            platform = random.choice(platforms)
            category = random.choice(content_categories)
            watched_duration = random.randint(10, 180) # minutes
            date_watched = (datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 365))).isoformat()
            
            history.append({
                "title": title,
                "platform": platform,
                "category": category,
                "watched_duration_mins": watched_duration,
                "date": date_watched
            })
            
        # Generate ratings
        ratings = []
        # Rate about 50% of watched content
        for item in history:
            if random.random() > 0.5:
                rating = random.randint(1, 5)
                ratings.append({
                    "title": item["title"],
                    "rating": rating,
                    "review": random.choice(["Great!", "Good", "Okay", "Not my cup of tea", "Masterpiece", "Boring"])
                })
        
        # Preferences
        preferred_categories = list(set([item['category'] for item in history]))[:3]
        
        user = {
            "username": username,
            "full_name": f"{first} {last}",
            "email": email,
            "role": "user",
            "subscription_tier": random.choice(["Basic", "Standard", "Premium"]),
            "joined_date": (datetime.datetime.now() - datetime.timedelta(days=random.randint(30, 700))).isoformat(),
            "history": history,
            "ratings": ratings,
            "preferences": preferred_categories,
            "total_watch_time_mins": sum(h['watched_duration_mins'] for h in history)
        }
        users.append(user)
        
    return users

if __name__ == "__main__":
    data = generate_users(1000)
    with open("new_data.json", "w") as f:
        json.dump(data, f, indent=4)
    print("Generated 1000 users in new_data.json")
