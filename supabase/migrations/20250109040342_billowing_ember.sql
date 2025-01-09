/*
  # Catering System Database Schema

  1. New Tables
    - `menu_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `price` (decimal)
      - `is_vegetarian` (boolean)
      - `allergens` (text[])
      - `created_at` (timestamp)

    - `recipes`
      - `id` (uuid, primary key)
      - `menu_item_id` (uuid, foreign key)
      - `name` (text)
      - `instructions` (text)
      - `created_at` (timestamp)

    - `recipe_ingredients`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, foreign key)
      - `name` (text)
      - `quantity` (decimal)
      - `unit` (text)

    - `events`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `delivery_address` (text)
      - `delivery_date` (date)
      - `delivery_time` (time)
      - `special_instructions` (text)
      - `event_type` (text)
      - `guest_count` (integer)
      - `dietary_restrictions` (text[])
      - `allergen_info` (text[])
      - `special_requests` (text)
      - `status` (text)
      - `total_amount` (decimal)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)

    - `event_items`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key)
      - `menu_item_id` (uuid, foreign key)
      - `quantity` (integer)
      - `type` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create menu_items table
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('appetizer', 'mainCourse', 'dessert', 'beverage', 'combo')),
  price decimal NOT NULL CHECK (price >= 0),
  is_vegetarian boolean DEFAULT false,
  allergens text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid REFERENCES menu_items ON DELETE CASCADE,
  name text NOT NULL,
  instructions text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create recipe_ingredients table
CREATE TABLE recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes ON DELETE CASCADE,
  name text NOT NULL,
  quantity decimal NOT NULL CHECK (quantity > 0),
  unit text NOT NULL CHECK (unit IN ('kg', 'g', 'l', 'ml', 'units'))
);

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  delivery_date date NOT NULL,
  delivery_time time NOT NULL,
  special_instructions text,
  event_type text NOT NULL CHECK (event_type IN ('wedding', 'birthday', 'corporate', 'other')),
  guest_count integer NOT NULL CHECK (guest_count > 0),
  dietary_restrictions text[] DEFAULT '{}',
  allergen_info text[] DEFAULT '{}',
  special_requests text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  total_amount decimal NOT NULL CHECK (total_amount >= 0),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

-- Create event_items table
CREATE TABLE event_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  type text NOT NULL CHECK (type IN ('individual', 'combo'))
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for menu items"
  ON menu_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can manage menu items"
  ON menu_items FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'staff');

CREATE POLICY "Staff can manage recipes"
  ON recipes FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'staff');

CREATE POLICY "Staff can manage recipe ingredients"
  ON recipe_ingredients FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'staff');

CREATE POLICY "Users can read their own events"
  ON events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their event items"
  ON event_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_items.event_id
      AND events.user_id = auth.uid()
    )
  );