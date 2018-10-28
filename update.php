<?php

if (isset($_GET['id'])) {
    $id = urldecode($_GET['id']);
}
if (isset($_GET['parent'])) {
    $parent = urldecode($_GET['parent']);
}
if (isset($_GET['voice'])) {
    $voice = urldecode($_GET['voice']);
}
if (isset($_GET['image'])) {
    $image = urldecode($_GET['image']);
}

$json = file_get_contents('grid.json');
$grid = json_decode($json, true);

function findReplace($node) {
    global $id;
    global $voice;
    global $image;
    if ($node['id'] === $id) {
        $node['title'] = $voice;
        $node['pic'] = $image;
        return $node;
    }
    if (isset($node['items'])) {
        foreach ($node['items'] as $index => $item) {
            $item = findReplace($item);
            if ($item) {
                $node['items'][$index] = $item;
                return $node;
            }
        }
    }
}

function findTreeUntree($node) {
    global $id;
    if ($node['id'] === $id) {
        if (isset($node['items'])) {
            unset($node['items']);
        } else {
            $node['items'] = [];
        }
        return $node;
    }
    if (isset($node['items'])) {
        foreach ($node['items'] as $index => $item) {
            $item = findTreeUntree($item);
            if ($item) {
                $node['items'][$index] = $item;
                return $node;
            }
        }
    }
}

function findAdd($node) {
    global $parent;
    global $voice;
    global $image;
    if ($node['id'] === $parent) {
        $new = [];
        $new['pic'] = $image;
        $new['title'] = $voice;
        $new['id'] = $parent . '-' . count($node['items']);
        array_push($node['items'], $new);
        return $node;
    }
    if (isset($node['items'])) {
        foreach ($node['items'] as $index => $item) {
            $item = findAdd($item);
            if ($item) {
                $node['items'][$index] = $item;
                return $node;
            }
        }
    }
}

if (isset($parent)) {
    $updated = findAdd($grid);
} else if (isset($image)) {
    $updated = findReplace($grid);
} else {
    $updated = findTreeUntree($grid);
}

if ($updated) {
    $fp = fopen('grid.json', 'w');
    fwrite($fp, json_encode($updated));
    fclose($fp);
}

?>