<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Url;

class UrlController extends Controller
{
    public function preview(Request $request)
    {
        $request->validate([
            'url' => 'active_url|required'
        ]);

        $url = Url::firstOrNew(['url' => $request->url]);

        if ($url->isDirty()) {
            $url->save();
        }

        return $url;
    }
}
