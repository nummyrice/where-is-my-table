from app.models import db, Tag

def seed_tags():
    wheelchair = Tag(
        name="wheelchair"
    )
    highchair = Tag(
        name="highchair"
    )
    outside = Tag(
        name="outside"
    )
    birthday = Tag(
        name="birthday"
    )
    party = Tag(
        name="party"
    )
    cork_service = Tag(
        name="cork service"
    )
    prepaid = Tag(
        name="prepaid"
    )
    auto_gratuity = Tag(
        name="auto gratuity"
    )
    inside = Tag(
        name="inside"
    )
    bar = Tag(
        name="bar"
    )
    private_dining = Tag(
        name="private dining"
    )
    walker = Tag(
        name="walker"
    )
    cafe = Tag(
        name="cafe"
    )
    treenut_allergy = Tag(
        name="treenut allergy"
    )
    shellfish_allergy = Tag(
        name="shellfish allergy"
    )
    soy_allergy = Tag(
        name="soy allergy"
    )
    peanut_allergy = Tag(
        name="peanut allergy"
    )
    dessert_only = Tag(
        name="dessert only"
    )
    vegetarian_menu = Tag(
        name='vegetarian menu'
    )

    db.session.add(wheelchair)
    db.session.add(highchair)
    db.session.add(outside)
    db.session.add(birthday)
    db.session.add(party)
    db.session.add(cork_service)
    db.session.add(prepaid)
    db.session.add(auto_gratuity)
    db.session.add(inside)
    db.session.add(bar)
    db.session.add(private_dining)
    db.session.add(walker)
    db.session.add(cafe)
    db.session.add(treenut_allergy)
    db.session.add(shellfish_allergy)
    db.session.add(soy_allergy)
    db.session.add(peanut_allergy)
    db.session.add(dessert_only)
    db.session.add(vegetarian_menu)
    db.session.commit()

def undo_tags():
    db.session.execute('TRUNCATE tags RESTART IDENTITY CASCADE;')
    db.session.commit()
