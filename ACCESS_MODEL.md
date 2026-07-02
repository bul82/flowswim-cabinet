# FlowSwim access model

## MVP decision

The interface keeps two visible profiles for now:

- `Ученик`
- `Тренер`

The product model still reserves four real access roles:

- `child`
- `parent`
- `coach`
- `admin`

This lets us launch a simple Mini App now and avoid rebuilding access rules later.

## Roles

### Child

A child can connect from their own phone.

Can see:

- their own schedule;
- nearest training;
- progress;
- achievements;
- coach comments marked as visible to the child.

Cannot see:

- payments;
- parent contacts;
- documents;
- medical certificates;
- internal coach notes;
- other students.

### Parent

A parent sees only their own child or children.

Can see:

- child profile;
- schedule;
- attendance;
- progress;
- coach comments;
- payments;
- documents;
- parent contacts;
- pickup permissions.

Can do:

- update parent contacts;
- upload documents;
- confirm attendance;
- connect a second parent;
- connect a child phone with limited rights.

### Coach

A coach sees only students from their own groups.

Can see:

- assigned groups;
- students in those groups;
- parent contacts;
- medical limitations;
- attendance;
- progress;
- schedule for assigned lessons.

Can do:

- mark attendance;
- update progress;
- add coach comments;
- invite a parent, if allowed by admin.

### Admin

An admin manages the school structure.

Can do:

- create and edit groups;
- assign coaches to groups;
- move students between groups;
- create and edit schedule;
- connect and revoke user access;
- manage payments and documents.

## Student creation

For MVP, a coach creates the student card.

Minimum fields:

- student name;
- age or birth date;
- group;
- level;
- optional child photo;
- optional medical limitations;
- private coach note.

The new card starts with status `waiting_parent`.

## Parent connection

After creating a student, the coach sends an invitation to the parent.

MVP method:

1. The system creates a short invitation code.
2. The coach sends the code or bot link to the parent.
3. The parent opens the bot.
4. The parent enters the code.
5. The parent Telegram ID is linked to the student.
6. The parent sees only this student.

The code should be one-time and time-limited.

## Child connection

Child connection uses a separate invite code.

Flow:

1. Parent or admin taps `Подключить телефон ребенка`.
2. The system creates a child-only code.
3. The child opens the bot from their own phone.
4. The child enters the code.
5. The child Telegram ID is linked to the same student with role `child`.
6. The child gets limited access.

Parent invite codes must never grant child access, and child invite codes must never grant parent access.

## Scheduling model

Schedule should be based on lessons, not plain text.

Core structure:

- group;
- coach;
- lesson date and time;
- pool;
- lane;
- topic;
- status.

Students see lessons through their group.

Coaches see lessons where they are assigned.

Admins see and manage all lessons.
