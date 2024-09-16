require 'faker'

# Clear existing data
puts "Clearing existing data..."
UserGroup.destroy_all
Group.destroy_all
User.destroy_all

def generate_text
  if [ true, false ].sample
    ""
  else
    Faker::Lorem.paragraph_by_chars(number: 250, supplemental: false)
  end
end

def weighted_privacy_setting
  weights = [ 0.6, 0.2, 0.2 ]  # 60% chance for 0, 20% for 1, 20% for 2
  random_value = rand

  case random_value
  when 0...weights[0]
    0
  when weights[0]...weights[0] + weights[1]
    1
  else
    2
  end
end

# Create Users
puts "Creating users..."
users = 50.times.map do
  User.create!(
    email: Faker::Internet.unique.email,
    password: 'password', # As requested, all users have the same password
    jti: SecureRandom.uuid
  )
end

User.create!(
  email: 'test@gmail.com',
  password: 'password',
  jti: SecureRandom.uuid
)

# Create Groups
puts "Creating groups..."
groups = 50.times.map do
  Group.create!(
    name: Faker::Company.unique.name,
    description: generate_text,
    privacy_setting: weighted_privacy_setting # Assuming 0, 1, 2 are valid privacy settings
  )
end

# Create UserGroups
puts "Creating user group associations..."
users.each do |user|
  # Each user joins 1-5 random groups
  groups.sample(rand(1..5)).each do |group|
    UserGroup.create!(
      user: user,
      group: group,
      role: rand(0..4), # Using the correct range for roles
      joined_at: Faker::Time.between(from: 1.year.ago, to: Time.now)
    )
  end
end

# Ensure each group has at least one admin or owner
puts "Ensuring each group has an admin or owner..."
groups.each do |group|
  unless group.user_groups.any? { |ug| [ 4 ].include?(ug.role) }
    admin_user = users.sample
    existing_association = UserGroup.find_by(user: admin_user, group: group)

    if existing_association
      existing_association.update!(role: 4)
    else
      UserGroup.create!(
        user: admin_user,
        group: group,
        role: 4,
        joined_at: Faker::Time.between(from: 1.year.ago, to: Time.now)
      )
    end
  end
end

puts "Seed data creation completed!"
puts "Created #{User.count} users, #{Group.count} groups, and #{UserGroup.count} user-group associations."
