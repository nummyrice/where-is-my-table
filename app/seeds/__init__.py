from flask.cli import AppGroup
from .users import seed_users, undo_users
from .statuses import seed_statuses, undo_statuses
from .tags import seed_tags, undo_tags
from .reservations import seed_reservations, undo_reservations
from .waitlist import seed_waitlist, undo_waitlist
from .join_tags import seed_tagged_reservations, seed_tagged_waitlist, undo_tagged_reservations, undo_tagged_waitlist
from .tables import seed_tables, undo_seed_tables
from .establishment import seed_establishments, undo_establishments

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_tables()
    seed_users()
    seed_statuses()
    seed_tags()
    seed_reservations()
    seed_waitlist()
    seed_tagged_reservations()
    seed_tagged_waitlist()
    seed_establishments()

    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_seed_tables()
    undo_users()
    undo_statuses()
    undo_tags()
    undo_reservations()
    undo_waitlist()
    undo_tagged_reservations()
    undo_tagged_waitlist()
    undo_establishments()
    # Add other undo functions here
